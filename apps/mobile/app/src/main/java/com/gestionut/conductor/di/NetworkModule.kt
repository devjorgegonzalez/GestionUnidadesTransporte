package com.gestionut.conductor.di

import com.gestionut.conductor.BuildConfig
import com.gestionut.conductor.data.preferences.AuthPreferences
import com.gestionut.conductor.data.remote.AuthInterceptor
import com.gestionut.conductor.data.remote.api.AuthApi
import com.gestionut.conductor.data.remote.api.ViajesApi
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import okhttp3.HttpUrl.Companion.toHttpUrlOrNull
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit
import javax.inject.Named
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides
    @Singleton
    @Named("dynamicBaseUrl")
    fun provideDynamicBaseUrlInterceptor(authPreferences: AuthPreferences): Interceptor {
        return Interceptor { chain ->
            var request = chain.request()
            try {
                val customUrl = runBlocking {
                    authPreferences.sessionFlow.first().customBaseUrl
                }
                if (!customUrl.isNullOrBlank()) {
                    val targetUrl = customUrl.toHttpUrlOrNull()
                    if (targetUrl != null) {
                        val newUrl = request.url.newBuilder()
                            .scheme(targetUrl.scheme)
                            .host(targetUrl.host)
                            .port(targetUrl.port)
                            .build()
                        request = request.newBuilder().url(newUrl).build()
                    }
                }
            } catch (e: Exception) {
                // Ignore and use default URL
            }
            chain.proceed(request)
        }
    }

    @Provides
    @Singleton
    fun provideOkHttpClient(
        authInterceptor: AuthInterceptor,
        @Named("dynamicBaseUrl") dynamicBaseUrlInterceptor: Interceptor
    ): OkHttpClient {
        val logging = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }

        return OkHttpClient.Builder()
            .addInterceptor(dynamicBaseUrlInterceptor)
            .addInterceptor(authInterceptor)
            .addInterceptor(logging)
            .connectTimeout(15, TimeUnit.SECONDS)
            .readTimeout(20, TimeUnit.SECONDS)
            .writeTimeout(20, TimeUnit.SECONDS)
            .build()
    }

    @Provides
    @Singleton
    fun provideRetrofit(okHttpClient: OkHttpClient): Retrofit {
        return Retrofit.Builder()
            .baseUrl(BuildConfig.BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    @Provides
    @Singleton
    fun provideAuthApi(retrofit: Retrofit): AuthApi {
        return retrofit.create(AuthApi::class.java)
    }

    @Provides
    @Singleton
    fun provideViajesApi(retrofit: Retrofit): ViajesApi {
        return retrofit.create(ViajesApi::class.java)
    }
}
