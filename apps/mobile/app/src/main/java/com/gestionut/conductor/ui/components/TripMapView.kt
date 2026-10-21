package com.gestionut.conductor.ui.components

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.model.BitmapDescriptorFactory
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.Tile
import com.google.android.gms.maps.model.TileProvider
import com.google.maps.android.compose.GoogleMap
import com.google.maps.android.compose.MapProperties
import com.google.maps.android.compose.MapType
import com.google.maps.android.compose.MapUiSettings
import com.google.maps.android.compose.Marker
import com.google.maps.android.compose.Polyline
import com.google.maps.android.compose.TileOverlay
import com.google.maps.android.compose.rememberCameraPositionState
import com.google.maps.android.compose.rememberMarkerState
import java.net.HttpURLConnection
import java.net.URL

@Composable
fun TripMapView(
    currentLat: Double?,
    currentLng: Double?,
    origenLat: Double,
    origenLng: Double,
    origenNombre: String,
    destinoLat: Double,
    destinoLng: Double,
    destinoNombre: String,
    rutaRecorrida: List<LatLng>,
    modifier: Modifier = Modifier
) {
    val effectiveLat = currentLat ?: rutaRecorrida.lastOrNull()?.latitude
    val effectiveLng = currentLng ?: rutaRecorrida.lastOrNull()?.longitude

    val initialPos = LatLng(
        effectiveLat ?: origenLat,
        effectiveLng ?: origenLng
    )

    val cameraPositionState = rememberCameraPositionState {
        position = CameraPosition.fromLatLngZoom(initialPos, 15f)
    }

    var hasCenteredOnFirstFix by remember { mutableStateOf(false) }

    val originMarkerState = rememberMarkerState(position = LatLng(origenLat, origenLng))
    val destinationMarkerState = rememberMarkerState(position = LatLng(destinoLat, destinoLng))
    val vehicleMarkerState = rememberMarkerState(
        position = LatLng(effectiveLat ?: origenLat, effectiveLng ?: origenLng)
    )

    val googleRasterTileProvider = remember {
        TileProvider { x, y, zoom ->
            try {
                val url = URL("https://mt1.google.com/vt/lyrs=m&x=$x&y=$y&z=$zoom&hl=es")
                val conn = (url.openConnection() as HttpURLConnection).apply {
                    connectTimeout = 5000
                    readTimeout = 5000
                    setRequestProperty("User-Agent", "Mozilla/5.0 (Linux; Android 14)")
                }
                val bytes = conn.inputStream.use { it.readBytes() }
                Tile(256, 256, bytes)
            } catch (e: Exception) {
                TileProvider.NO_TILE
            }
        }
    }

    LaunchedEffect(origenLat, origenLng) {
        originMarkerState.position = LatLng(origenLat, origenLng)
    }

    LaunchedEffect(destinoLat, destinoLng) {
        destinationMarkerState.position = LatLng(destinoLat, destinoLng)
    }

    LaunchedEffect(effectiveLat, effectiveLng) {
        if (effectiveLat != null && effectiveLng != null) {
            val newPos = LatLng(effectiveLat, effectiveLng)
            vehicleMarkerState.position = newPos
            if (!hasCenteredOnFirstFix) {
                cameraPositionState.animate(
                    CameraUpdateFactory.newLatLngZoom(newPos, 15f),
                    1000
                )
                hasCenteredOnFirstFix = true
            }
        }
    }

    GoogleMap(
        modifier = modifier.fillMaxSize(),
        cameraPositionState = cameraPositionState,
        properties = MapProperties(
            isMyLocationEnabled = false,
            mapType = MapType.NONE
        ),
        uiSettings = MapUiSettings(
            zoomControlsEnabled = true,
            myLocationButtonEnabled = false,
            compassEnabled = true,
            scrollGesturesEnabled = true,
            zoomGesturesEnabled = true,
            rotationGesturesEnabled = true,
            tiltGesturesEnabled = true
        )
    ) {
        // Google Maps roadmap tile layer so streets and POIs render even when Maps SDK for Android vector tiles are not enabled on the API key
        TileOverlay(
            tileProvider = googleRasterTileProvider,
            zIndex = 0f
        )

        // Origin Marker (Green)
        Marker(
            state = originMarkerState,
            title = "Origen: $origenNombre",
            icon = BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_GREEN),
            zIndex = 1f
        )

        // Destination Marker (Red)
        Marker(
            state = destinationMarkerState,
            title = "Destino: $destinoNombre",
            icon = BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_RED),
            zIndex = 1f
        )

        // Traveled route polyline (Solid high-contrast cyan/blue line)
        if (rutaRecorrida.isNotEmpty()) {
            Polyline(
                points = rutaRecorrida,
                color = Color(0xFF0284C7), // High-contrast Blue
                width = 12f,
                zIndex = 2f
            )
        }

        // Current vehicle marker (Azure/Cyan with vehicle indicator)
        if (effectiveLat != null && effectiveLng != null) {
            Marker(
                state = vehicleMarkerState,
                title = "Ubicación actual de la UT",
                icon = BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_AZURE),
                zIndex = 3f
            )
        }
    }
}
