package com.gestionut.conductor.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import com.gestionut.conductor.data.local.dao.PuntoTrackingDao
import com.gestionut.conductor.data.local.entity.PuntoTrackingLocalEntity

@Database(
    entities = [PuntoTrackingLocalEntity::class],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun puntoTrackingDao(): PuntoTrackingDao

    companion object {
        const val DATABASE_NAME = "gestion_ut_offline.db"
    }
}
