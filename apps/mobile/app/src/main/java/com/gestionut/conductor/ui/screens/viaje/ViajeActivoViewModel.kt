package com.gestionut.conductor.ui.screens.viaje

import android.content.Context
import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.gestionut.conductor.data.local.entity.PuntoTrackingLocalEntity
import com.gestionut.conductor.data.remote.dto.ViajeResponseDto
import com.gestionut.conductor.data.repository.ViajeRepository
import com.gestionut.conductor.service.TrackingForegroundService
import com.gestionut.conductor.service.TrackingServiceState
import com.google.android.gms.maps.model.LatLng
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject
import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.sin
import kotlin.math.sqrt

data class ViajeActivoUiState(
    val viajeId: String = "",
    val placa: String = "",
    val origenNombre: String = "",
    val destinoNombre: String = "",
    val origenLat: Double = 0.0,
    val origenLng: Double = 0.0,
    val destinoLat: Double = 0.0,
    val destinoLng: Double = 0.0,
    val kmSugerido: Double = 0.0,
    val kmRecorridoEstimado: Double = 0.0,
    val isLoadingFinalizar: Boolean = false,
    val errorMessage: String? = null,
    val viajeFinalizadoResumen: ViajeResponseDto? = null
)

@HiltViewModel
class ViajeActivoViewModel @Inject constructor(
    private val viajeRepository: ViajeRepository,
    savedStateHandle: SavedStateHandle
) : ViewModel() {

    private val viajeId: String = savedStateHandle["viajeId"] ?: ""
    private val placa: String = savedStateHandle["placa"] ?: "UT"
    private val origenNombre: String = try {
        java.net.URLDecoder.decode(savedStateHandle["origenNombre"] ?: "Origen", java.nio.charset.StandardCharsets.UTF_8.toString())
    } catch (e: Exception) {
        savedStateHandle["origenNombre"] ?: "Origen"
    }
    private val destinoNombre: String = try {
        java.net.URLDecoder.decode(savedStateHandle["destinoNombre"] ?: "Destino", java.nio.charset.StandardCharsets.UTF_8.toString())
    } catch (e: Exception) {
        savedStateHandle["destinoNombre"] ?: "Destino"
    }
    private val origenLat: Double = savedStateHandle.get<Float>("origenLat")?.toDouble() ?: 10.4806
    private val origenLng: Double = savedStateHandle.get<Float>("origenLng")?.toDouble() ?: -66.8617
    private val destinoLat: Double = savedStateHandle.get<Float>("destinoLat")?.toDouble() ?: 10.5050
    private val destinoLng: Double = savedStateHandle.get<Float>("destinoLng")?.toDouble() ?: -66.9146
    private val kmSugerido: Double = savedStateHandle.get<Float>("kmSugerido")?.toDouble() ?: 0.0

    private val _uiState = MutableStateFlow(
        ViajeActivoUiState(
            viajeId = viajeId,
            placa = placa,
            origenNombre = origenNombre,
            destinoNombre = destinoNombre,
            origenLat = origenLat,
            origenLng = origenLng,
            destinoLat = destinoLat,
            destinoLng = destinoLng,
            kmSugerido = kmSugerido
        )
    )
    val uiState: StateFlow<ViajeActivoUiState> = _uiState.asStateFlow()

    // Tracking state from ForegroundService
    val trackingState: StateFlow<TrackingServiceState> = TrackingForegroundService.trackingState

    // Unsynced points count in Room
    val noSincronizadosCount: StateFlow<Int> = viajeRepository.contarNoSincronizados(viajeId)
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    // Traveled points list for drawing polyline and calculating real-time distance
    val puntosRuta: StateFlow<List<LatLng>> = viajeRepository.observarPuntosViaje(viajeId)
        .map { puntos ->
            calcularDistanciaRecorrida(puntos)
            puntos.map { LatLng(it.lat, it.lng) }
        }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    private fun calcularDistanciaRecorrida(puntos: List<PuntoTrackingLocalEntity>) {
        if (puntos.size < 2) return
        var totalMetros = 0.0
        for (i in 0 until puntos.size - 1) {
            val p1 = puntos[i]
            val p2 = puntos[i + 1]
            totalMetros += calcularHaversineMetros(p1.lat, p1.lng, p2.lat, p2.lng)
        }
        val kmCalculado = Math.round((totalMetros / 1000.0) * 100.0) / 100.0
        _uiState.value = _uiState.value.copy(kmRecorridoEstimado = kmCalculado)
    }

    private fun calcularHaversineMetros(lat1: Double, lon1: Double, lat2: Double, lon2: Double): Double {
        val r = 6371000.0 // Earth radius in meters
        val dLat = Math.toRadians(lat2 - lat1)
        val dLon = Math.toRadians(lon2 - lon1)
        val a = sin(dLat / 2) * sin(dLat / 2) +
                cos(Math.toRadians(lat1)) * cos(Math.toRadians(lat2)) *
                sin(dLon / 2) * sin(dLon / 2)
        val c = 2 * atan2(sqrt(a), sqrt(1 - a))
        val dist = r * c
        return if (dist > 10000) 0.0 else dist // Filter outliers > 10km
    }

    fun limpiarError() {
        _uiState.value = _uiState.value.copy(errorMessage = null)
    }

    fun terminarViaje(context: Context, onViajeTerminado: () -> Unit) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoadingFinalizar = true, errorMessage = null)

            // Step 1: Call API to finalize trip and send any pending points
            val finishResult = viajeRepository.finalizarViaje(viajeId)

            if (finishResult.isSuccess) {
                // Step 2: Stop Foreground tracking service on success
                TrackingForegroundService.stopTracking(context)
                val resumen = finishResult.getOrNull()
                _uiState.value = _uiState.value.copy(
                    isLoadingFinalizar = false,
                    viajeFinalizadoResumen = resumen
                )
            } else {
                _uiState.value = _uiState.value.copy(
                    isLoadingFinalizar = false,
                    errorMessage = finishResult.exceptionOrNull()?.message ?: "Error al finalizar el viaje"
                )
            }
        }
    }
}
