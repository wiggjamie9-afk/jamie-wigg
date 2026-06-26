package com.neuraltwin.app.data.network

import android.content.Context
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import com.jakewharton.timber.Timber

/**
 * Process-wide encrypted store for the authenticated session (JWT + basic user info).
 *
 * Uses EncryptedSharedPreferences with AES-256-GCM encryption to protect sensitive data
 * (token, userId, email, name) at rest. All values are encrypted using the Android Keystore.
 *
 * Why an object rather than an injected class: the [AuthInterceptor] runs on
 * OkHttp's networking threads and must read the current token synchronously
 * without holding a Context. Keeping the token in a process-global, backed by
 * encrypted SharedPreferences for persistence across restarts, lets both the Hilt graph
 * and the plain [ApiClient] singleton share one source of truth.
 *
 * Call [init] once from Application.onCreate() before any network request.
 */
object TokenStore {
    private const val PREFS_NAME = "neural_twin_session_encrypted"
    private const val KEY_TOKEN = "jwt_token"
    private const val KEY_USER_ID = "user_id"
    private const val KEY_EMAIL = "user_email"
    private const val KEY_NAME = "user_name"

    private lateinit var prefs: EncryptedSharedPreferences

    // Cached in memory so the interceptor never touches disk on the hot path.
    @Volatile var token: String? = null
        private set
    @Volatile var userId: String? = null
        private set
    @Volatile var email: String? = null
        private set
    @Volatile var name: String? = null
        private set

    fun init(context: Context) {
        try {
            val masterKey = MasterKey.Builder(context)
                .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
                .build()

            prefs = EncryptedSharedPreferences.create(
                context,
                PREFS_NAME,
                masterKey,
                EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
                EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
            ) as EncryptedSharedPreferences

            token = prefs.getString(KEY_TOKEN, null)
            userId = prefs.getString(KEY_USER_ID, null)
            email = prefs.getString(KEY_EMAIL, null)
            name = prefs.getString(KEY_NAME, null)

            Timber.d("TokenStore initialized with encrypted prefs")
        } catch (e: Exception) {
            Timber.e(e, "Failed to initialize encrypted TokenStore")
            throw e
        }
    }

    val isLoggedIn: Boolean
        get() = !token.isNullOrBlank()

    fun saveSession(token: String, userId: String, email: String, name: String) {
        this.token = token
        this.userId = userId
        this.email = email
        this.name = name
        try {
            prefs.edit()
                .putString(KEY_TOKEN, token)
                .putString(KEY_USER_ID, userId)
                .putString(KEY_EMAIL, email)
                .putString(KEY_NAME, name)
                .apply()
            Timber.d("Session saved to encrypted prefs")
        } catch (e: Exception) {
            Timber.e(e, "Failed to save session to encrypted prefs")
            throw e
        }
    }

    fun clear() {
        token = null
        userId = null
        email = null
        name = null
        try {
            prefs.edit().clear().apply()
            Timber.d("Session cleared from encrypted prefs")
        } catch (e: Exception) {
            Timber.e(e, "Failed to clear encrypted prefs")
            throw e
        }
    }
}
