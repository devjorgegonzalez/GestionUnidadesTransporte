package com.gestionut.conductor.data.local.entity

import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey
import java.util.UUID

@Entity(
    tableName = "puntos_tracking_locales",
    indices = [
        Index(value = ["viajeId"]),
        Index(value = ["viajeId", "sincronizado"])
    ]
)
data class PuntoTrackingLocalEntity(
    @PrimaryKey
    val idPuntoCliente: String = UUID.randomUUID().toString(),
    val viajeId: String,
    val lat: Double,
    val lng: Double,
    val velocidadKmh: Float,
    val precisionMetros: Float,
    val capturadoEn: Long = System.currentTimeMillis(),
    val sincronizado: Boolean = false
)
