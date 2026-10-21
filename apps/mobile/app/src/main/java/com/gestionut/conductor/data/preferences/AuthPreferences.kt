package com.gestionut.conductor.data.preferences

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "conductor_auth_prefs")

data class ConductorSession(
    val token: String?,
    val conductorId: String?,
    val conductorNombre: String?,
    val conductorCedula: String?,
    val utId: String?,
    val utPlaca: String?,
    val activeViajeId: String?,
    val customBaseUrl: String?
)

@Singleton
class AuthPreferences @Inject constructor(
    @ApplicationContext private val context: Context
) {
    companion object {
        val KEY_TOKEN = stringPreferencesKey("access_token")
        val KEY_CONDUCTOR_ID = stringPreferencesKey("conductor_id")
        val KEY_CONDUCTOR_NOMBRE = stringPreferencesKey("conductor_nombre")
        val KEY_CONDUCTOR_CEDULA = stringPreferencesKey("conductor_cedula")
        val KEY_UT_ID = stringPreferencesKey("ut_id")
        val KEY_UT_PLACA = stringPreferencesKey("ut_placa")
        val KEY_ACTIVE_VIAJE_ID = stringPreferencesKey("active_viaje_id")
        val KEY_CUSTOM_BASE_URL = stringPreferencesKey("custom_base_url")
    }

    val sessionFlow: Flow<ConductorSession> = context.dataStore.data.map { prefs ->
        ConductorSession(
            token = prefs[KEY_TOKEN],
            conductorId = prefs[KEY_CONDUCTOR_ID],
            conductorNombre = prefs[KEY_CONDUCTOR_NOMBRE],
            conductorCedula = prefs[KEY_CONDUCTOR_CEDULA],
            utId = prefs[KEY_UT_ID],
            utPlaca = prefs[KEY_UT_PLACA],
            activeViajeId = prefs[KEY_ACTIVE_VIAJE_ID],
            customBaseUrl = prefs[KEY_CUSTOM_BASE_URL]
        )
    }

    suspend fun saveSession(
        token: String,
        conductorId: String,
        nombre: String,
        cedula: String,
        utId: String,
        placa: String
    ) {
        context.dataStore.edit { prefs ->
            prefs[KEY_TOKEN] = token
            prefs[KEY_CONDUCTOR_ID] = conductorId
            prefs[KEY_CONDUCTOR_NOMBRE] = nombre
            prefs[KEY_CONDUCTOR_CEDULA] = cedula
            prefs[KEY_UT_ID] = utId
            prefs[KEY_UT_PLACA] = placa
        }
    }

    suspend fun setActiveViajeId(viajeId: String?) {
        context.dataStore.edit { prefs ->
            if (viajeId != null) {
                prefs[KEY_ACTIVE_VIAJE_ID] = viajeId
            } else {
                prefs.remove(KEY_ACTIVE_VIAJE_ID)
            }
        }
    }

    suspend fun setCustomBaseUrl(url: String?) {
        context.dataStore.edit { prefs ->
            if (url != null) {
                prefs[KEY_CUSTOM_BASE_URL] = url
            } else {
                prefs.remove(KEY_CUSTOM_BASE_URL)
            }
        }
    }

    suspend fun clearSession() {
        context.dataStore.edit { prefs ->
            val customUrl = prefs[KEY_CUSTOM_BASE_URL]
            prefs.clear()
            if (customUrl != null) {
                prefs[KEY_CUSTOM_BASE_URL] = customUrl
            }
        }
    }

    suspend fun getToken(): String? {
        return context.dataStore.data.first()[KEY_TOKEN]
    }
}
