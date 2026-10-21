package com.gestionut.conductor.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sin

@Composable
fun SpeedometerGauge(
    speedKmh: Float,
    maxSpeed: Float = 140f,
    modifier: Modifier = Modifier
) {
    val animatedSpeed by animateFloatAsState(
        targetValue = speedKmh.coerceIn(0f, maxSpeed),
        animationSpec = tween(durationMillis = 300),
        label = "SpeedAnimation"
    )

    val trackColor = MaterialTheme.colorScheme.surfaceVariant
    val activeColor = when {
        animatedSpeed > 90f -> Color(0xFFE53935) // Red
        animatedSpeed > 60f -> Color(0xFFFB8C00) // Orange
        else -> Color(0xFF0D9488) // Teal / Primary
    }

    Box(
        modifier = modifier.size(240.dp),
        contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val strokeWidth = 18.dp.toPx()
            val diameter = size.minDimension - strokeWidth
            val radius = diameter / 2
            val center = Offset(size.width / 2, size.height / 2)

            val startAngle = 135f
            val sweepAngle = 270f

            // Background arc track
            drawArc(
                color = trackColor,
                startAngle = startAngle,
                sweepAngle = sweepAngle,
                useCenter = false,
                topLeft = Offset(center.x - radius, center.y - radius),
                size = Size(diameter, diameter),
                style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
            )

            // Active speed arc
            val currentSweep = (animatedSpeed / maxSpeed) * sweepAngle
            drawArc(
                color = activeColor,
                startAngle = startAngle,
                sweepAngle = currentSweep,
                useCenter = false,
                topLeft = Offset(center.x - radius, center.y - radius),
                size = Size(diameter, diameter),
                style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
            )

            // Speedometer Needle indicator
            val needleAngleRad = (startAngle + currentSweep) * (PI / 180f)
            val needleLength = radius - 24.dp.toPx()
            val needleEnd = Offset(
                x = (center.x + needleLength * cos(needleAngleRad)).toFloat(),
                y = (center.y + needleLength * sin(needleAngleRad)).toFloat()
            )

            drawLine(
                color = activeColor,
                start = center,
                end = needleEnd,
                strokeWidth = 5.dp.toPx(),
                cap = StrokeCap.Round
            )

            drawCircle(
                color = activeColor,
                radius = 9.dp.toPx(),
                center = center
            )
        }

        // Digital Speed Readout in Center
        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.height(28.dp))
            Text(
                text = String.format("%.0f", animatedSpeed),
                fontSize = 48.sp,
                fontWeight = FontWeight.Black,
                color = MaterialTheme.colorScheme.onSurface
            )
            Text(
                text = "km/h",
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}
