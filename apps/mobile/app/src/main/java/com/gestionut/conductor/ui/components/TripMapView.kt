package com.gestionut.conductor.ui.components

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.model.BitmapDescriptorFactory
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.GoogleMap
import com.google.maps.android.compose.MapProperties
import com.google.maps.android.compose.MapUiSettings
import com.google.maps.android.compose.Marker
import com.google.maps.android.compose.MarkerState
import com.google.maps.android.compose.Polyline
import com.google.maps.android.compose.rememberCameraPositionState

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
    val initialPos = LatLng(
        currentLat ?: origenLat,
        currentLng ?: origenLng
    )

    val cameraPositionState = rememberCameraPositionState {
        position = CameraPosition.fromLatLngZoom(initialPos, 14f)
    }

    LaunchedEffect(currentLat, currentLng) {
        if (currentLat != null && currentLng != null) {
            cameraPositionState.animate(
                CameraUpdateFactory.newLatLng(LatLng(currentLat, currentLng)),
                1000
            )
        }
    }

    GoogleMap(
        modifier = modifier.fillMaxSize(),
        cameraPositionState = cameraPositionState,
        properties = MapProperties(isMyLocationEnabled = false),
        uiSettings = MapUiSettings(
            zoomControlsEnabled = false,
            myLocationButtonEnabled = false,
            compassEnabled = true
        )
    ) {
        // Origin Marker (Green)
        Marker(
            state = MarkerState(position = LatLng(origenLat, origenLng)),
            title = "Origen: $origenNombre",
            icon = BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_GREEN)
        )

        // Destination Marker (Red)
        Marker(
            state = MarkerState(position = LatLng(destinoLat, destinoLng)),
            title = "Destino: $destinoNombre",
            icon = BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_RED)
        )

        // Traveled route polyline (Solid high-contrast cyan/blue line)
        if (rutaRecorrida.isNotEmpty()) {
            Polyline(
                points = rutaRecorrida,
                color = Color(0xFF0284C7), // High-contrast Blue
                width = 12f
            )
        }

        // Current vehicle marker (Azure/Cyan with vehicle indicator)
        if (currentLat != null && currentLng != null) {
            Marker(
                state = MarkerState(position = LatLng(currentLat, currentLng)),
                title = "Ubicación actual de la UT",
                icon = BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_AZURE)
            )
        }
    }
}
