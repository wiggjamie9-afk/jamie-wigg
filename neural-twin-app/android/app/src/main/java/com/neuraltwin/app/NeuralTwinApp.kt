package com.neuraltwin.app

import android.app.Application
import com.neuraltwin.app.data.network.TokenStore
import dagger.hilt.android.HiltAndroidApp
import timber.log.Timber

@HiltAndroidApp
class NeuralTwinApp : Application() {
    override fun onCreate() {
        super.onCreate()

        // Restore any persisted JWT session before the first network call.
        TokenStore.init(this)

        // Initialize Timber for logging
        if (BuildConfig.DEBUG) {
            Timber.plant(Timber.DebugTree())
        }
    }
}
