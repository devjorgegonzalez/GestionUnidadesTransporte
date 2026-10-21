package com.gestionut.conductor.data.repository

import com.gestionut.conductor.data.local.dao.PuntoTrackingDao
import com.gestionut.conductor.data.local.entity.PuntoTrackingLocalEntity
import com.gestionut.conductor.data.preferences.AuthPreferences
import com.gestionut.conductor.data.remote.api.ViajesApi
import com.gestionut.conductor.data.remote.dto.FinalizarViajeRequest
import com.gestionut.conductor.data.remote.dto.PuntoTrackingInputDto
import com.gestionut.conductor.data.remote.dto.ReservaDto
import com.gestionut.conductor.data.remote.dto.TrackingBatchRequest
import com.gestionut.conductor.data.remote.dto.ViajeResponseDto
import kotlinx.coroutines.flow.Flow
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ViajeRepository @Inject constructor(
    private val viajesApi: ViajesApi,
    private val puntoTrackingDao: PuntoTrackingDao,
    private val authPreferences: AuthPreferences
) {
    private val isoDateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US).apply {
        timeZone = TimeZone.getTimeZone("UTC")
    }

    suspend fun getReservasHoy(): Result<List<ReservaDto>> {
        return try {
            val response = viajesApi.getReservasHoy()
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                val errorMsg = response.errorBody()?.string() ?: "Error al obtener reservas (${response.code()})"
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun iniciarViaje(viajeId: String): Result<ViajeResponseDto> {
        return try {
            val response = viajesApi.iniciarViaje(viajeId)
            if (response.isSuccessful && response.body() != null) {
                authPreferences.setActiveViajeId(viajeId)
                Result.success(response.body()!!)
            } else {
                val errorMsg = response.errorBody()?.string() ?: "Error al iniciar viaje (${response.code()})"
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun guardarPuntoLocal(punto: PuntoTrackingLocalEntity) {
        puntoTrackingDao.insert(punto)
    }

    suspend fun sincronizarLote(viajeId: String): Result<Int> {
        return try {
            val pendientes = puntoTrackingDao.getPuntosNoSincronizados(viajeId)
            if (pendientes.isEmpty()) {
                return Result.success(0)
            }

            val dtos = pendientes.map { p ->
                PuntoTrackingInputDto(
                    idPuntoCliente = p.idPuntoCliente,
                    lat = p.lat,
                    lng = p.lng,
                    velocidadKmh = p.velocidadKmh,
                    precisionMetros = p.precisionMetros,
                    capturadoEn = synchronized(isoDateFormat) {
                        isoDateFormat.format(Date(p.capturadoEn))
                    }
                )
            }

            val response = viajesApi.enviarBatchTracking(viajeId, TrackingBatchRequest(dtos))
            if (response.isSuccessful) {
                val idsSincronizados = pendientes.map { it.idPuntoCliente }
                puntoTrackingDao.marcarComoSincronizados(idsSincronizados)
                Result.success(pendientes.size)
            } else {
                val errorMsg = response.errorBody()?.string() ?: "Error batch API (${response.code()})"
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            // Offline-first: Keep in Room, return failure so service waits for connectivity
            Result.failure(e)
        }
    }

    suspend fun finalizarViaje(viajeId: String): Result<ViajeResponseDto> {
        return try {
            val pendientes = puntoTrackingDao.getPuntosNoSincronizados(viajeId)
            val dtosFinales = if (pendientes.isNotEmpty()) {
                pendientes.map { p ->
                    PuntoTrackingInputDto(
                        idPuntoCliente = p.idPuntoCliente,
                        lat = p.lat,
                        lng = p.lng,
                        velocidadKmh = p.velocidadKmh,
                        precisionMetros = p.precisionMetros,
                        capturadoEn = synchronized(isoDateFormat) {
                            isoDateFormat.format(Date(p.capturadoEn))
                        }
                    )
                }
            } else {
                null
            }

            val response = viajesApi.finalizarViaje(viajeId, FinalizarViajeRequest(dtosFinales))
            if (response.isSuccessful && response.body() != null) {
                if (pendientes.isNotEmpty()) {
                    puntoTrackingDao.marcarComoSincronizados(pendientes.map { it.idPuntoCliente })
                }
                authPreferences.setActiveViajeId(null)
                Result.success(response.body()!!)
            } else {
                val errorMsg = response.errorBody()?.string() ?: "Error al finalizar viaje (${response.code()})"
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    fun observarPuntosViaje(viajeId: String): Flow<List<PuntoTrackingLocalEntity>> {
        return puntoTrackingDao.getPuntosPorViaje(viajeId)
    }

    fun contarNoSincronizados(viajeId: String): Flow<Int> {
        return puntoTrackingDao.contarNoSincronizados(viajeId)
    }
}
