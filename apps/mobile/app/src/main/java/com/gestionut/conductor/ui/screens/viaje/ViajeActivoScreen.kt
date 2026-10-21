package com.gestionut.conductor.ui.screens.viaje

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Stop
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.gestionut.conductor.ui.components.SpeedometerGauge
import com.gestionut.conductor.ui.components.SyncStatusBadge
import com.gestionut.conductor.ui.components.TripMapView

@Composable
fun ViajeActivoScreen(
    viewModel: ViajeActivoViewModel,
    onNavigateBack: () -> Unit
) {
    val state by viewModel.uiState.collectAsState()
    val trackingState by viewModel.trackingState.collectAsState()
    val pendingPointsCount by viewModel.noSincronizadosCount.collectAsState()
    val puntosRuta by viewModel.puntosRuta.collectAsState()
    val context = LocalContext.current

    var showConfirmDialog by remember { mutableStateOf(false) }

    // Summary dialog when trip successfully ends
    if (state.viajeFinalizadoResumen != null) {
        val resumen = state.viajeFinalizadoResumen!!
        AlertDialog(
            onDismissRequest = { /* Require user to click button */ },
            icon = {
                Icon(
                    imageVector = if (resumen.excesoKilometraje == true) Icons.Default.Warning else Icons.Default.CheckCircle,
                    contentDescription = null,
                    tint = if (resumen.excesoKilometraje == true) Color(0xFFD97706) else Color(0xFF16A34A),
                    modifier = Modifier.size(44.dp)
                )
            },
            title = {
                Text(
                    text = "Viaje Finalizado",
                    fontWeight = FontWeight.Bold,
                    fontSize = 20.sp
                )
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("El viaje ha sido registrado exitosamente.")
                    Text(
                        text = "Kilometraje Real: ${resumen.kilometrajeReal ?: state.kmRecorridoEstimado} km",
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "Kilometraje Sugerido: ${state.kmSugerido} km",
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    if (resumen.excesoKilometraje == true) {
                        Text(
                            text = "Aviso: El recorrido excedió en más de 10% el kilometraje sugerido por Google Maps.",
                            color = Color(0xFFD97706),
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 13.sp
                        )
                    }
                    Text(
                        text = "La unidad ha regresado a estado DISPONIBLE.",
                        fontSize = 12.sp,
                        color = Color(0xFF16A34A)
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = onNavigateBack,
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                ) {
                    Text("Aceptar y Salir")
                }
            }
        )
    }

    // Confirmation dialog before ending trip
    if (showConfirmDialog) {
        AlertDialog(
            onDismissRequest = { showConfirmDialog = false },
            title = { Text("¿Terminar Viaje?", fontWeight = FontWeight.Bold) },
            text = {
                Text(
                    "Al terminar el viaje se enviarán los registros GPS acumulados, se calculará la distancia total recorrida y se actualizará el odómetro de la UT ${state.placa}."
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        showConfirmDialog = false
                        viewModel.terminarViaje(context) {
                            // Handled via state.viajeFinalizadoResumen dialog
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFDC2626))
                ) {
                    Text("Sí, Terminar")
                }
            },
            dismissButton = {
                OutlinedButton(onClick = { showConfirmDialog = false }) {
                    Text("Cancelar")
                }
            }
        )
    }

    Scaffold(
        topBar = {
            Surface(
                color = MaterialTheme.colorScheme.surface,
                tonalElevation = 3.dp
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 12.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "VIAJE ACTIVO",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Black,
                                color = Color(0xFF16A34A)
                            )
                            Text(
                                text = "UT: ${state.placa}",
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                        }

                        SyncStatusBadge(
                            isOnline = trackingState.isOnline,
                            pendingPointsCount = pendingPointsCount,
                            lastSyncMessage = trackingState.lastSyncMessage
                        )
                    }

                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "${state.origenNombre} -> ${state.destinoNombre}",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        maxLines = 1
                    )
                }
            }
        },
        bottomBar = {
            Surface(
                color = MaterialTheme.colorScheme.surface,
                tonalElevation = 6.dp
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                ) {
                    Button(
                        onClick = { showConfirmDialog = true },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(52.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFDC2626)),
                        enabled = !state.isLoadingFinalizar
                    ) {
                        if (state.isLoadingFinalizar) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(24.dp),
                                color = Color.White,
                                strokeWidth = 2.dp
                            )
                        } else {
                            Icon(Icons.Default.Stop, contentDescription = null)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "Terminar Viaje",
                                fontWeight = FontWeight.Bold,
                                fontSize = 16.sp
                            )
                        }
                    }
                }
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Speedometer & Stats Section (Upper 45%)
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 10.dp),
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.35f))
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    // Gauge
                    SpeedometerGauge(
                        speedKmh = trackingState.currentSpeedKmh,
                        modifier = Modifier.size(210.dp)
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    // Trip Stats row: Recorrido Real vs Sugerido
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceEvenly
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = "Recorrido Actual",
                                fontSize = 12.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Text(
                                text = "${state.kmRecorridoEstimado} km",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Black,
                                color = MaterialTheme.colorScheme.primary
                            )
                        }

                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = "Sugerido Maps",
                                fontSize = 12.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Text(
                                text = "${state.kmSugerido} km",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                        }

                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = "Puntos GPS",
                                fontSize = 12.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Text(
                                text = "${puntosRuta.size}",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                        }
                    }
                }
            }

            // Google Map View (Lower section)
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
                    .padding(horizontal = 16.dp)
            ) {
                TripMapView(
                    currentLat = trackingState.currentLat,
                    currentLng = trackingState.currentLng,
                    origenLat = state.origenLat,
                    origenLng = state.origenLng,
                    origenNombre = state.origenNombre,
                    destinoLat = state.destinoLat,
                    destinoLng = state.destinoLng,
                    destinoNombre = state.destinoNombre,
                    rutaRecorrida = puntosRuta
                )
            }

            Spacer(modifier = Modifier.height(8.dp))
        }
    }
}
