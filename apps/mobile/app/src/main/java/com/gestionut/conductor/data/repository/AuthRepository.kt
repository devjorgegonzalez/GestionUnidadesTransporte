package com.gestionut.conductor.data.repository

import com.gestionut.conductor.data.preferences.AuthPreferences
import com.gestionut.conductor.data.preferences.ConductorSession
import com.gestionut.conductor.data.remote.api.AuthApi
import com.gestionut.conductor.data.remote.dto.LoginConductorRequest
import com.gestionut.conductor.data.remote.dto.LoginConductorResponse
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthRepository @Inject constructor(
    private val authApi: AuthApi,
    private val authPreferences: AuthPreferences
) {
    val sessionFlow: Flow<ConductorSession> = authPreferences.sessionFlow

    suspend fun login(cedula: String, placa: String): Result<LoginConductorResponse> {
        return try {
            val response = authApi.loginConductor(
                LoginConductorRequest(
                    cedula = cedula.trim(),
                    placa = placa.trim().uppercase().filter { it.isLetterOrDigit() }
                )
            )

            if (response.isSuccessful && response.body() != null) {
                val body = response.body()!!.data
                authPreferences.saveSession(
                    token = body.accessToken,
                    conductorId = body.conductor.id,
                    nombre = "${body.conductor.nombre} ${body.conductor.apellido}",
                    cedula = body.conductor.cedula,
                    utId = body.unidadTransporte.id,
                    placa = body.unidadTransporte.placa
                )
                Result.success(body)
            } else {
                val errorMsg = response.errorBody()?.string() ?: "Error de autenticación (${response.code()})"
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun logout() {
        authPreferences.clearSession()
    }
}
