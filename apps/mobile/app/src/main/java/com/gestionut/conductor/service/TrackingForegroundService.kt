package com.gestionut.conductor.service

import android.Manifest
import android.annotation.SuppressLint
import android.app.Notification
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.content.pm.ServiceInfo
import android.location.Location
import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import android.net.NetworkRequest
import android.os.Build
import android.os.IBinder
import android.os.Looper
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.core.content.ContextCompat
import com.gestionut.conductor.GestionUTApp
import com.gestionut.conductor.R
import com.gestionut.conductor.data.local.entity.PuntoTrackingLocalEntity
import com.gestionut.conductor.data.repository.ViajeRepository
import com.gestionut.conductor.ui.MainActivity
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationResult
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import javax.inject.Inject
import kotlin.math.max

data class TrackingServiceState(
    val isTracking: Boolean = false,
    val viajeId: String? = null,
    val placa: String? = null,
    val currentSpeedKmh: Float = 0f,
    val currentLat: Double? = null,
    val currentLng: Double? = null,
    val isOnline: Boolean = true,
    val lastSyncMessage: String = "Iniciando servicio..."
)

@AndroidEntryPoint
class TrackingForegroundService : Service() {

    @Inject
    lateinit var viajeRepository: ViajeRepository

    private val serviceJob = Job()
    private val serviceScope = CoroutineScope(Dispatchers.IO + serviceJob)

    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var locationCallback: LocationCallback
    private lateinit var connectivityManager: ConnectivityManager
    private var networkCallback: ConnectivityManager.NetworkCallback? = null

    private var activeViajeId: String? = null
    private var activePlaca: String? = null
    private var periodicSyncJob: Job? = null

    companion object {
        private const val TAG = "TrackingService"
        const val NOTIFICATION_ID = 2001
        const val ACTION_START = "ACTION_START_TRACKING"
        const val ACTION_STOP = "ACTION_STOP_TRACKING"
        const val EXTRA_VIAJE_ID = "EXTRA_VIAJE_ID"
        const val EXTRA_PLACA = "EXTRA_PLACA"

        private val _trackingState = MutableStateFlow(TrackingServiceState())
        val trackingState = _trackingState.asStateFlow()

        fun hasLocationPermission(context: Context): Boolean {
            val fine = ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED
            val coarse = ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.ACCESS_COARSE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED
            return fine || coarse
        }

        fun startTracking(context: Context, viajeId: String, placa: String) {
            if (!hasLocationPermission(context)) {
                Log.w(TAG, "No se puede iniciar TrackingForegroundService: sin permisos de ubicación")
                _trackingState.value = _trackingState.value.copy(
                    isTracking = false,
                    viajeId = viajeId,
                    placa = placa,
                    lastSyncMessage = "Permiso de ubicación pendiente"
                )
                return
            }
            val intent = Intent(context, TrackingForegroundService::class.java).apply {
                action = ACTION_START
                putExtra(EXTRA_VIAJE_ID, viajeId)
                putExtra(EXTRA_PLACA, placa)
            }
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    context.startForegroundService(intent)
                } else {
                    context.startService(intent)
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error al iniciar TrackingForegroundService", e)
            }
        }

        fun stopTracking(context: Context) {
            try {
                val intent = Intent(context, TrackingForegroundService::class.java).apply {
                    action = ACTION_STOP
                }
                context.startService(intent)
            } catch (e: Exception) {
                Log.e(TAG, "Error al detener TrackingForegroundService", e)
            }
        }
    }

    override fun onCreate() {
        super.onCreate()
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        connectivityManager = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager

        setupLocationCallback()
        setupNetworkCallback()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_START -> {
                val viajeId = intent.getStringExtra(EXTRA_VIAJE_ID) ?: return START_NOT_STICKY
                val placa = intent.getStringExtra(EXTRA_PLACA) ?: "UT"
                startForegroundTracking(viajeId, placa)
            }
            ACTION_STOP -> {
                stopForegroundTracking()
            }
        }
        return START_STICKY
    }

    private fun startForegroundTracking(viajeId: String, placa: String) {
        activeViajeId = viajeId
        activePlaca = placa

        if (!hasLocationPermission(this)) {
            Log.w(TAG, "Cancelando startForeground: permisos de ubicación no concedidos")
            _trackingState.value = _trackingState.value.copy(
                isTracking = false,
                viajeId = viajeId,
                placa = placa,
                lastSyncMessage = "Permiso de ubicación requerido"
            )
            stopSelf()
            return
        }

        val notification = buildNotification("Viaje en curso - Registrando recorrido de UT $placa")
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                startForeground(
                    NOTIFICATION_ID,
                    notification,
                    ServiceInfo.FOREGROUND_SERVICE_TYPE_LOCATION
                )
            } else {
                startForeground(NOTIFICATION_ID, notification)
            }
        } catch (e: Exception) {
            Log.e(TAG, "No se pudo elevar el servicio a foreground con tipo LOCATION", e)
            _trackingState.value = _trackingState.value.copy(
                isTracking = false,
                viajeId = viajeId,
                placa = placa,
                lastSyncMessage = "Active el permiso de ubicación para el GPS"
            )
            stopSelf()
            return
        }

        _trackingState.value = _trackingState.value.copy(
            isTracking = true,
            viajeId = viajeId,
            placa = placa,
            lastSyncMessage = "Tracking activo"
        )

        requestLocationUpdates()
        startPeriodicSync(viajeId)
    }

    @SuppressLint("MissingPermission")
    private fun requestLocationUpdates() {
        val locationRequest = LocationRequest.Builder(Priority.PRIORITY_HIGH_ACCURACY, 2_000L)
            .setMinUpdateIntervalMillis(1_000L)
            .setMinUpdateDistanceMeters(0f)
            .build()

        try {
            fusedLocationClient.requestLocationUpdates(
                locationRequest,
                locationCallback,
                Looper.getMainLooper()
            )
        } catch (e: Exception) {
            Log.e(TAG, "Error solicitando actualizaciones de ubicación", e)
        }
    }

    private fun setupLocationCallback() {
        locationCallback = object : LocationCallback() {
            override fun onLocationResult(result: LocationResult) {
                for (location in result.locations) {
                    handleNewLocation(location)
                }
            }
        }
    }

    private fun handleNewLocation(location: Location) {
        val viajeId = activeViajeId ?: return
        val speedKmh = max(0f, location.speed * 3.6f)

        _trackingState.value = _trackingState.value.copy(
            currentSpeedKmh = speedKmh,
            currentLat = location.latitude,
            currentLng = location.longitude
        )

        serviceScope.launch {
            val puntoLocal = PuntoTrackingLocalEntity(
                viajeId = viajeId,
                lat = location.latitude,
                lng = location.longitude,
                velocidadKmh = speedKmh,
                precisionMetros = location.accuracy,
                capturadoEn = System.currentTimeMillis(),
                sincronizado = false
            )
            viajeRepository.guardarPuntoLocal(puntoLocal)
            Log.d(TAG, "Punto GPS guardado localmente: (${location.latitude}, ${location.longitude}) $speedKmh km/h")
        }
    }

    private fun startPeriodicSync(viajeId: String) {
        periodicSyncJob?.cancel()
        periodicSyncJob = serviceScope.launch {
            syncBatch(viajeId)
            while (isActive) {
                delay(300_000L) // 5 minutes = 300,000 ms
                syncBatch(viajeId)
            }
        }
    }

    private suspend fun syncBatch(viajeId: String) {
        val result = viajeRepository.sincronizarLote(viajeId)
        result.onSuccess { count ->
            val msg = if (count > 0) "Sincronizados $count puntos con API" else "Sincronizado con API"
            _trackingState.value = _trackingState.value.copy(
                isOnline = true,
                lastSyncMessage = msg
            )
        }.onFailure { err ->
            _trackingState.value = _trackingState.value.copy(
                isOnline = false,
                lastSyncMessage = "Sin conexión con el API — registros guardados en dispositivo, esperando conexión..."
            )
            Log.w(TAG, "API no disponible para sincronizar lote. Datos retenidos en Room: ${err.message}")
        }
    }

    private fun setupNetworkCallback() {
        val networkRequest = NetworkRequest.Builder()
            .addCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
            .build()

        networkCallback = object : ConnectivityManager.NetworkCallback() {
            override fun onAvailable(network: Network) {
                _trackingState.value = _trackingState.value.copy(isOnline = true)
                val viajeId = activeViajeId ?: return
                serviceScope.launch {
                    Log.i(TAG, "Conexión de red detectada. Reintentando sincronización de registros acumulados...")
                    syncBatch(viajeId)
                }
            }

            override fun onLost(network: Network) {
                _trackingState.value = _trackingState.value.copy(
                    isOnline = false,
                    lastSyncMessage = "Sin conexión con el API — guardando puntos localmente..."
                )
            }
        }

        try {
            connectivityManager.registerNetworkCallback(networkRequest, networkCallback!!)
        } catch (e: Exception) {
            Log.e(TAG, "Error registrando NetworkCallback", e)
        }
    }

    private fun buildNotification(contentText: String): Notification {
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            Intent(this, MainActivity::class.java),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        return NotificationCompat.Builder(this, GestionUTApp.CHANNEL_ID)
            .setContentTitle("Gestión UT - Conductor")
            .setContentText(contentText)
            .setSmallIcon(android.R.drawable.ic_menu_mylocation)
            .setOngoing(true)
            .setContentIntent(pendingIntent)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setCategory(NotificationCompat.CATEGORY_SERVICE)
            .build()
    }

    private fun stopForegroundTracking() {
        periodicSyncJob?.cancel()
        fusedLocationClient.removeLocationUpdates(locationCallback)

        networkCallback?.let {
            try {
                connectivityManager.unregisterNetworkCallback(it)
            } catch (e: Exception) {
                Log.e(TAG, "Error desregistrando NetworkCallback", e)
            }
        }

        _trackingState.value = TrackingServiceState(isTracking = false)
        stopForeground(STOP_FOREGROUND_REMOVE)
        stopSelf()
    }

    override fun onDestroy() {
        serviceJob.cancel()
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
