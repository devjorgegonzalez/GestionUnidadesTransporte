package com.gestionut.conductor.util

import org.json.JSONArray
import org.json.JSONObject

object ApiErrorParser {
    /**
     * Parses a backend JSON error response from NestJS (e.g. {"statusCode":400,"message":"...","error":"Bad Request"})
     * and extracts a clean, human-readable message string.
     */
    fun parseErrorMessage(rawError: String?, fallbackMessage: String = "Ocurrió un error en el servidor"): String {
        if (rawError.isNullOrBlank()) return fallbackMessage

        val trimmed = rawError.trim()
        if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
            return trimmed
        }

        return try {
            val json = JSONObject(trimmed)
            when {
                json.has("message") -> {
                    val msgObj = json.get("message")
                    when (msgObj) {
                        is JSONArray -> {
                            val items = mutableListOf<String>()
                            for (i in 0 until msgObj.length()) {
                                items.add(msgObj.getString(i))
                            }
                            items.joinToString("\n")
                        }
                        else -> msgObj.toString()
                    }
                }
                json.has("error") -> json.getString("error")
                else -> fallbackMessage
            }
        } catch (_: Exception) {
            trimmed.ifBlank { fallbackMessage }
        }
    }
}
