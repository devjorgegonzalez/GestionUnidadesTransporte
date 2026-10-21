package com.gestionut.conductor.ui.navigation

import androidx.compose.runtime.Composable
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.gestionut.conductor.ui.screens.login.LoginReservasScreen
import com.gestionut.conductor.ui.screens.login.LoginReservasViewModel
import com.gestionut.conductor.ui.screens.viaje.ViajeActivoScreen
import com.gestionut.conductor.ui.screens.viaje.ViajeActivoViewModel
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

sealed class Screen(val route: String) {
    object LoginReservas : Screen("login_reservas")
    object ViajeActivo : Screen(
        "viaje_activo/{viajeId}/{placa}/{origenNombre}/{destinoNombre}/{origenLat}/{origenLng}/{destinoLat}/{destinoLng}/{kmSugerido}"
    ) {
        fun createRoute(
            viajeId: String,
            placa: String,
            origenNombre: String,
            destinoNombre: String,
            origenLat: Double,
            origenLng: Double,
            destinoLat: Double,
            destinoLng: Double,
            kmSugerido: Double
        ): String {
            val safeOrigen = URLEncoder.encode(origenNombre, StandardCharsets.UTF_8.toString())
            val safeDestino = URLEncoder.encode(destinoNombre, StandardCharsets.UTF_8.toString())
            return "viaje_activo/$viajeId/$placa/$safeOrigen/$safeDestino/${origenLat.toFloat()}/${origenLng.toFloat()}/${destinoLat.toFloat()}/${destinoLng.toFloat()}/${kmSugerido.toFloat()}"
        }
    }
}

@Composable
fun NavGraph(
    navController: NavHostController = rememberNavController()
) {
    NavHost(
        navController = navController,
        startDestination = Screen.LoginReservas.route
    ) {
        composable(Screen.LoginReservas.route) {
            val viewModel: LoginReservasViewModel = hiltViewModel()
            LoginReservasScreen(
                viewModel = viewModel,
                onNavigateToTrip = { reserva ->
                    val origenNombre = reserva.origen.nombre ?: reserva.origen.direccion ?: "Origen"
                    val destinoNombre = reserva.destino.nombre ?: reserva.destino.direccion ?: "Destino"
                    val placa = viewModel.uiState.value.placa.ifBlank { "UT" }

                    val route = Screen.ViajeActivo.createRoute(
                        viajeId = reserva.id,
                        placa = placa,
                        origenNombre = origenNombre,
                        destinoNombre = destinoNombre,
                        origenLat = reserva.origen.lat,
                        origenLng = reserva.origen.lng,
                        destinoLat = reserva.destino.lat,
                        destinoLng = reserva.destino.lng,
                        kmSugerido = reserva.kilometrajeSugerido
                    )
                    navController.navigate(route)
                }
            )
        }

        composable(
            route = Screen.ViajeActivo.route,
            arguments = listOf(
                navArgument("viajeId") { type = NavType.StringType },
                navArgument("placa") { type = NavType.StringType },
                navArgument("origenNombre") { type = NavType.StringType },
                navArgument("destinoNombre") { type = NavType.StringType },
                navArgument("origenLat") { type = NavType.FloatType },
                navArgument("origenLng") { type = NavType.FloatType },
                navArgument("destinoLat") { type = NavType.FloatType },
                navArgument("destinoLng") { type = NavType.FloatType },
                navArgument("kmSugerido") { type = NavType.FloatType }
            )
        ) {
            val viewModel: ViajeActivoViewModel = hiltViewModel()
            ViajeActivoScreen(
                viewModel = viewModel,
                onNavigateBack = {
                    navController.popBackStack(Screen.LoginReservas.route, inclusive = false)
                }
            )
        }
    }
}
