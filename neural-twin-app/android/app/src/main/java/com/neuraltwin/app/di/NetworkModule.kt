package com.neuraltwin.app.di

import com.neuraltwin.app.data.network.ApiClient
import com.neuraltwin.app.data.network.ApiService
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

/**
 * Hilt bindings for the networking layer. Bridges the existing ApiClient
 * (which builds the Retrofit ApiService) into the Hilt graph so that
 * Repository — and therefore every @HiltViewModel that injects it — can be
 * constructed by Dagger.
 */
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    @Provides
    @Singleton
    fun provideApiService(): ApiService = ApiClient.apiService
}
