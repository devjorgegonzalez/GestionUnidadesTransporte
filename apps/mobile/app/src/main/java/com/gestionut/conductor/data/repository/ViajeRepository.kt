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
import com.gestionut.conductor.util.ApiErrorParser
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

    companion object {
        // Tamaño máximo de lote por petición HTTP y por sentencia SQLite IN (:ids)
        private const val BATCH_CHUNK_SIZE = 200
    }

    suspend fun getReservasHoy(): Result<List<ReservaDto>> {
        return try {
            val response = viajesApi.getReservasHoy()
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!.data)
            } else {
                val rawError = response.errorBody()?.string()
                val errorMsg = ApiErrorParser.parseErrorMessage(rawError, "Error al obtener reservas (${response.code()})")
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
                Result.success(response.body()!!.data)
            } else {
                val rawError = response.errorBody()?.string()
                val errorMsg = ApiErrorParser.parseErrorMessage(rawError, "Error al iniciar viaje (${response.code()})")
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

            var totalSincronizados = 0
            val chunks = pendientes.chunked(BATCH_CHUNK_SIZE)

            for (chunk in chunks) {
                val dtos = chunk.map { p ->
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
                    val idsSincronizados = chunk.map { it.idPuntoCliente }
                    puntoTrackingDao.marcarComoSincronizados(idsSincronizados)
                    totalSincronizados += chunk.size
                } else {
                    val rawError = response.errorBody()?.string()
                    val errorMsg = ApiErrorParser.parseErrorMessage(rawError, "Error batch API (${response.code()})")
                    return Result.failure(Exception(errorMsg))
                }
            }

            Result.success(totalSincronizados)
        } catch (e: Exception) {
            // Offline-first: Keep remaining chunks in Room, return failure so service waits for connectivity
            Result.failure(e)
        }
    }

    suspend fun finalizarViaje(viajeId: String): Result<ViajeResponseDto> {
        return try {
            val pendientes = puntoTrackingDao.getPuntosNoSincronizados(viajeId)
            val chunks = pendientes.chunked(BATCH_CHUNK_SIZE)

            // Si hay múltiples lotes acumulados offline, enviamos primero los lotes previos en bloques de 200
            if (chunks.size > 1) {
                for (i in 0 until chunks.size - 1) {
                    val chunk = chunks[i]
                    val dtosChunk = chunk.map { p ->
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
                    val batchResponse = viajesApi.enviarBatchTracking(viajeId, TrackingBatchRequest(dtosChunk))
                    if (batchResponse.isSuccessful) {
                        puntoTrackingDao.marcarComoSincronizados(chunk.map { it.idPuntoCliente })
                    } else {
                        val rawError = batchResponse.errorBody()?.string()
                        val errorMsg = ApiErrorParser.parseErrorMessage(rawError, "Error sincronizando lote previo (${batchResponse.code()})")
                        return Result.failure(Exception(errorMsg))
                    }
                }
            }

            val ultimoChunk = chunks.lastOrNull()
            val dtosFinales = ultimoChunk?.map { p ->
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

            val response = viajesApi.finalizarViaje(viajeId, FinalizarViajeRequest(puntos = dtosFinales))
            if (response.isSuccessful && response.body() != null) {
                if (ultimoChunk != null && ultimoChunk.isNotEmpty()) {
                    puntoTrackingDao.marcarComoSincronizados(ultimoChunk.map { it.idPuntoCliente })
                }
                authPreferences.setActiveViajeId(null)
                Result.success(response.body()!!.data)
            } else {
                val rawError = response.errorBody()?.string()
                val errorMsg = ApiErrorParser.parseErrorMessage(rawError, "Error al finalizar viaje (${response.code()})")
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
