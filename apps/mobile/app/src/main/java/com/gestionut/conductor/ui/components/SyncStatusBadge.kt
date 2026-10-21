package com.gestionut.conductor.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun SyncStatusBadge(
    isOnline: Boolean,
    pendingPointsCount: Int,
    lastSyncMessage: String,
    modifier: Modifier = Modifier
) {
    val bgColor = if (isOnline && pendingPointsCount == 0) {
        Color(0xFFE8F5E9) // Light green
    } else {
        Color(0xFFFFF3E0) // Light amber/orange
    }

    val dotColor = if (isOnline && pendingPointsCount == 0) {
        Color(0xFF2E7D32) // Green
    } else {
        Color(0xFFE65100) // Orange
    }

    val textColor = if (isOnline && pendingPointsCount == 0) {
        Color(0xFF1B5E20)
    } else {
        Color(0xFFBF360C)
    }

    val displayText = when {
        !isOnline && pendingPointsCount > 0 ->
            "Sin conexión con el API — $pendingPointsCount registros en dispositivo, esperando conexión..."
        !isOnline ->
            "Sin conexión con el API — esperando conexión..."
        pendingPointsCount > 0 ->
            "Conectado — $pendingPointsCount registros pendientes de sincronizar"
        else ->
            "Sincronizado con API"
    }

    Row(
        modifier = modifier
            .clip(RoundedCornerShape(20.dp))
            .background(bgColor)
            .padding(horizontal = 12.dp, vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(8.dp)
                .clip(CircleShape)
                .background(dotColor)
        )
        Spacer(modifier = Modifier.width(8.dp))
        Text(
            text = displayText,
            fontSize = 11.sp,
            fontWeight = FontWeight.SemiBold,
            color = textColor,
            maxLines = 2
        )
    }
}
