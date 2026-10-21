package com.gestionut.conductor.ui.screens.login

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.gestionut.conductor.data.preferences.AuthPreferences
import com.gestionut.conductor.data.preferences.ConductorSession
import com.gestionut.conductor.data.remote.dto.ReservaDto
import com.gestionut.conductor.data.repository.AuthRepository
import com.gestionut.conductor.data.repository.ViajeRepository
import com.gestionut.conductor.service.TrackingForegroundService
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

data class LoginReservasUiState(
    val cedula: String = "",
    val placa: String = "",
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val reservas: List<ReservaDto> = emptyList(),
    val busquedaRealizada: Boolean = false,
    val viajeIniciado: ReservaDto? = null
)

@HiltViewModel
class LoginReservasViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val viajeRepository: ViajeRepository,
    private val authPreferences: AuthPreferences
) : ViewModel() {

    private val _uiState = MutableStateFlow(LoginReservasUiState())
    val uiState: StateFlow<LoginReservasUiState> = _uiState.asStateFlow()

    val session: StateFlow<ConductorSession> = authPreferences.sessionFlow
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = ConductorSession(null, null, null, null, null, null, null, null)
        )

    init {
        viewModelScope.launch {
            authPreferences.sessionFlow.collect { sess ->
                if (!sess.conductorCedula.isNullOrBlank() && _uiState.value.cedula.isBlank()) {
                    _uiState.value = _uiState.value.copy(
                        cedula = sess.conductorCedula,
                        placa = sess.utPlaca ?: ""
                    )
                }
            }
        }
    }

    fun onCedulaChange(value: String) {
        _uiState.value = _uiState.value.copy(cedula = value, errorMessage = null)
    }

    fun onPlacaChange(value: String) {
        _uiState.value = _uiState.value.copy(placa = value.uppercase(), errorMessage = null)
    }

    fun buscarReservas() {
        val cedula = _uiState.value.cedula.trim()
        val placa = _uiState.value.placa.trim().uppercase()

        if (cedula.isBlank() || placa.isBlank()) {
            _uiState.value = _uiState.value.copy(
                errorMessage = "Por favor ingrese la cédula y la placa de la UT."
            )
            return
        }

        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)

            // Step 1: Login conductor
            val loginResult = authRepository.login(cedula, placa)
            if (loginResult.isFailure) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = loginResult.exceptionOrNull()?.message ?: "Error al autenticar conductor"
                )
                return@launch
            }

            // Step 2: Fetch today's reservations
            val reservasResult = viajeRepository.getReservasHoy()
            _uiState.value = _uiState.value.copy(
                isLoading = false,
                busquedaRealizada = true,
                reservas = reservasResult.getOrDefault(emptyList()),
                errorMessage = reservasResult.exceptionOrNull()?.message
            )
        }
    }

    fun iniciarViaje(reserva: ReservaDto, context: Context, onNavigateToTrip: (ReservaDto) -> Unit) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)

            val startResult = if (reserva.estado == "EN_CURSO") {
                // Already started, just resume
                Result.success(reserva)
            } else {
                viajeRepository.iniciarViaje(reserva.id)
            }

            if (startResult.isSuccess) {
                val placa = _uiState.value.placa.ifBlank { "UT" }
                TrackingForegroundService.startTracking(context, reserva.id, placa)
                _uiState.value = _uiState.value.copy(isLoading = false, viajeIniciado = reserva)
                onNavigateToTrip(reserva)
            } else {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = startResult.exceptionOrNull()?.message ?: "Error al iniciar el viaje"
                )
            }
        }
    }

    fun cerrarSesion() {
        viewModelScope.launch {
            authRepository.logout()
            _uiState.value = LoginReservasUiState()
        }
    }
}
