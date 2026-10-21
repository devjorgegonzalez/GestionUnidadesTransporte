package com.gestionut.conductor.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.gestionut.conductor.data.local.entity.PuntoTrackingLocalEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface PuntoTrackingDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(punto: PuntoTrackingLocalEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(puntos: List<PuntoTrackingLocalEntity>)

    @Query("SELECT * FROM puntos_tracking_locales WHERE viajeId = :viajeId AND sincronizado = 0 ORDER BY capturadoEn ASC")
    suspend fun getPuntosNoSincronizados(viajeId: String): List<PuntoTrackingLocalEntity>

    @Query("UPDATE puntos_tracking_locales SET sincronizado = 1 WHERE idPuntoCliente IN (:ids)")
    suspend fun marcarComoSincronizados(ids: List<String>)

    @Query("SELECT * FROM puntos_tracking_locales WHERE viajeId = :viajeId ORDER BY capturadoEn ASC")
    fun getPuntosPorViaje(viajeId: String): Flow<List<PuntoTrackingLocalEntity>>

    @Query("SELECT COUNT(*) FROM puntos_tracking_locales WHERE viajeId = :viajeId AND sincronizado = 0")
    fun contarNoSincronizados(viajeId: String): Flow<Int>

    @Query("DELETE FROM puntos_tracking_locales WHERE viajeId = :viajeId")
    suspend fun deletePuntosViaje(viajeId: String)
}
