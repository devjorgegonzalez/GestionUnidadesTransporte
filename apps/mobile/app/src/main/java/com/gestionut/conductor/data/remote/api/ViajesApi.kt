package com.gestionut.conductor.data.remote.api

import com.gestionut.conductor.data.remote.dto.ApiResponse
import com.gestionut.conductor.data.remote.dto.FinalizarViajeRequest
import com.gestionut.conductor.data.remote.dto.ReservaDto
import com.gestionut.conductor.data.remote.dto.TrackingBatchRequest
import com.gestionut.conductor.data.remote.dto.ViajeResponseDto
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface ViajesApi {

    @GET("viajes/hoy")
    suspend fun getReservasHoy(): Response<ApiResponse<List<ReservaDto>>>

    @POST("viajes/{id}/iniciar")
    suspend fun iniciarViaje(
        @Path("id") viajeId: String
    ): Response<ApiResponse<ViajeResponseDto>>

    @POST("viajes/{id}/tracking/batch")
    suspend fun enviarBatchTracking(
        @Path("id") viajeId: String,
        @Body request: TrackingBatchRequest
    ): Response<ApiResponse<Map<String, Any>>>

    @POST("viajes/{id}/finalizar")
    suspend fun finalizarViaje(
        @Path("id") viajeId: String,
        @Body request: FinalizarViajeRequest
    ): Response<ApiResponse<ViajeResponseDto>>
}
