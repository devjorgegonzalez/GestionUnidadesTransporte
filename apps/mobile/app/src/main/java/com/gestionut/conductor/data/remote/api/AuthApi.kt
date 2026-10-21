package com.gestionut.conductor.data.remote.api

import com.gestionut.conductor.data.remote.dto.LoginConductorRequest
import com.gestionut.conductor.data.remote.dto.LoginConductorResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApi {
    @POST("auth/conductor/login")
    suspend fun loginConductor(
        @Body request: LoginConductorRequest
    ): Response<LoginConductorResponse>
}
