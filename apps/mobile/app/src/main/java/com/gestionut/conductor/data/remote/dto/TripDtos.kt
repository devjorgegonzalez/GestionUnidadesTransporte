package com.gestionut.conductor.data.remote.dto

import com.google.gson.annotations.SerializedName

data class LoginConductorRequest(
    val cedula: String,
    val placa: String
)

data class ConductorDto(
    @SerializedName("id", alternate = ["_id"])
    val id: String,
    val nombre: String,
    val apellido: String,
    val cedula: String,
    val telefono: String? = null
)

data class UnidadTransporteDto(
    @SerializedName("id", alternate = ["_id"])
    val id: String,
    val placa: String,
    val marca: String,
    val modelo: String,
    val kilometraje: Double,
    val estado: String
)

data class LoginConductorResponse(
    val accessToken: String,
    val conductor: ConductorDto,
    val unidadTransporte: UnidadTransporteDto
)

data class PuntoGeograficoDto(
    val nombre: String? = null,
    val direccion: String? = null,
    val lat: Double,
    val lng: Double
)

data class ReservaDto(
    @SerializedName("_id", alternate = ["id"])
    val id: String,
    val conductorId: Any? = null,
    val utId: Any? = null,
    val fechaInicio: String,
    val estado: String,
    val origen: PuntoGeograficoDto,
    val destino: PuntoGeograficoDto,
    val kilometrajeSugerido: Double = 0.0,
    val kilometrajeReal: Double? = null,
    val excesoKilometraje: Boolean? = null
)

data class PuntoTrackingInputDto(
    val idPuntoCliente: String,
    val lat: Double,
    val lng: Double,
    val velocidadKmh: Float,
    val precisionMetros: Float,
    val capturadoEn: String
)

data class TrackingBatchRequest(
    val puntos: List<PuntoTrackingInputDto>
)

data class FinalizarViajeRequest(
    val puntosFinales: List<PuntoTrackingInputDto>? = null
)

data class ViajeResponseDto(
    @SerializedName("_id", alternate = ["id"])
    val id: String,
    val estado: String,
    val kilometrajeReal: Double? = null,
    val excesoKilometraje: Boolean? = null,
    val fechaFin: String? = null,
    val mensaje: String? = null
)
