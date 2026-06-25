package com.neuraltwin.app.data.network

import com.neuraltwin.app.BuildConfig
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiClient {
    /**
     * Base URL for the Neural Twin backend.
     *
     * 10.0.2.2 is the Android emulator's special alias for the host machine's
     * localhost — so this reaches the backend running in Docker on the dev's
     * Mac at port 5000. On a physical device, replace this with the deployed
     * backend URL (e.g. https://neural-twin.up.railway.app/api/) or use
     * `adb reverse tcp:5000 tcp:5000` and point at http://localhost:5000/api/.
     *
     * Cleartext HTTP to these hosts is whitelisted in network_security_config.xml.
     */
    const val BASE_URL = "http://10.0.2.2:5000/api/"

    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = if (BuildConfig.DEBUG) {
            HttpLoggingInterceptor.Level.BODY
        } else {
            HttpLoggingInterceptor.Level.NONE
        }
    }

    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(AuthInterceptor())
        .addInterceptor(loggingInterceptor)
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)   // Claude calls can take a while
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()

    val retrofit: Retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    val apiService: ApiService = retrofit.create(ApiService::class.java)
}
