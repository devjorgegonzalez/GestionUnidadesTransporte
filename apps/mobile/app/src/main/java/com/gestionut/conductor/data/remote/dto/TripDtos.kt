package com.gestionut.conductor.data.remote.dto

import com.google.gson.annotations.SerializedName

data class ApiResponse<T>(
    @SerializedName("data")
    val data: T
)

data class LoginConductorRequest(
    val cedula: String,
    val placa: String
)

data class ConductorDto(
    @SerializedName("id", alternate = ["_id"])
    val id: String = "",
    val nombre: String = "",
    val apellido: String = "",
    val cedula: String = "",
    val telefono: String? = null
)

data class UnidadTransporteDto(
    @SerializedName("id", alternate = ["_id"])
    val id: String = "",
    val placa: String = "",
    val marca: String = "",
    val modelo: String = "",
    val kilometraje: Double = 0.0,
    val estado: String = ""
)

data class LoginConductorResponse(
    val accessToken: String,
    val conductor: ConductorDto,
    @SerializedName("ut", alternate = ["unidadTransporte"])
    val unidadTransporte: UnidadTransporteDto,
    val reservasDelDia: List<ReservaDto>? = null
)

data class PuntoGeograficoDto(
    val nombre: String? = null,
    val direccion: String? = null,
    val lat: Double = 0.0,
    val lng: Double = 0.0
)

data class ReservaDto(
    @SerializedName("_id", alternate = ["id"])
    val id: String = "",
    val conductorId: Any? = null,
    val utId: Any? = null,
    val placaUt: String? = null,
    val cedulaConductor: String? = null,
    val nombreConductor: String? = null,
    @SerializedName("fechaHoraInicioProgramada", alternate = ["fechaInicio"])
    val fechaInicio: String? = null,
    val estado: String = "",
    val origen: PuntoGeograficoDto = PuntoGeograficoDto(),
    val destino: PuntoGeograficoDto = PuntoGeograficoDto(),
    @SerializedName("kmSugeridosGoogle", alternate = ["kilometrajeSugerido"])
    val kilometrajeSugerido: Double = 0.0,
    @SerializedName("kmRealesGps", alternate = ["kilometrajeReal"])
    val kilometrajeReal: Double? = null,
    @SerializedName("excedeUmbralKm", alternate = ["excesoKilometraje"])
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
    @SerializedName("puntos", alternate = ["puntosFinales"])
    val puntos: List<PuntoTrackingInputDto>? = null
)

data class ViajeResponseDto(
    @SerializedName("_id", alternate = ["id"])
    val id: String = "",
    val estado: String = "",
    @SerializedName("kmRealesGps", alternate = ["kilometrajeReal"])
    val kilometrajeReal: Double? = null,
    @SerializedName("excedeUmbralKm", alternate = ["excesoKilometraje"])
    val excesoKilometraje: Boolean? = null,
    @SerializedName("porcentajeDesviacionKm")
    val porcentajeDesviacionKm: Double? = null,
    val fechaFin: String? = null,
    val mensaje: String? = null,
    val reserva: ReservaDto? = null
)
