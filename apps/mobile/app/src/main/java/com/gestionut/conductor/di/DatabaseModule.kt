package com.gestionut.conductor.di

import android.content.Context
import androidx.room.Room
import com.gestionut.conductor.data.local.AppDatabase
import com.gestionut.conductor.data.local.dao.PuntoTrackingDao
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideAppDatabase(
        @ApplicationContext context: Context
    ): AppDatabase {
        return Room.databaseBuilder(
            context,
            AppDatabase::class.java,
            AppDatabase.DATABASE_NAME
        )
            .fallbackToDestructiveMigration()
            .build()
    }

    @Provides
    @Singleton
    fun providePuntoTrackingDao(database: AppDatabase): PuntoTrackingDao {
        return database.puntoTrackingDao()
    }
}
