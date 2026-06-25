package com.neuraltwin.app.data.network

import android.content.Context
import android.content.SharedPreferences

/**
 * Process-wide store for the authenticated session (JWT + basic user info).
 *
 * Why an object rather than an injected class: the [AuthInterceptor] runs on
 * OkHttp's networking threads and must read the current token synchronously
 * without holding a Context. Keeping the token in a process-global, backed by
 * SharedPreferences for persistence across restarts, lets both the Hilt graph
 * and the plain [ApiClient] singleton share one source of truth.
 *
 * Call [init] once from Application.onCreate() before any network request.
 *
 * NOTE: For production, migrate the prefs to EncryptedSharedPreferences
 * (androidx.security:security-crypto) so the token is encrypted at rest.
 */
object TokenStore {
    private const val PREFS_NAME = "neural_twin_session"
    private const val KEY_TOKEN = "jwt_token"
    private const val KEY_USER_ID = "user_id"
    private const val KEY_EMAIL = "user_email"
    private const val KEY_NAME = "user_name"

    private lateinit var prefs: SharedPreferences

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
        prefs = context.applicationContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        token = prefs.getString(KEY_TOKEN, null)
        userId = prefs.getString(KEY_USER_ID, null)
        email = prefs.getString(KEY_EMAIL, null)
        name = prefs.getString(KEY_NAME, null)
    }

    val isLoggedIn: Boolean
        get() = !token.isNullOrBlank()

    fun saveSession(token: String, userId: String, email: String, name: String) {
        this.token = token
        this.userId = userId
        this.email = email
        this.name = name
        prefs.edit()
            .putString(KEY_TOKEN, token)
            .putString(KEY_USER_ID, userId)
            .putString(KEY_EMAIL, email)
            .putString(KEY_NAME, name)
            .apply()
    }

    fun clear() {
        token = null
        userId = null
        email = null
        name = null
        prefs.edit().clear().apply()
    }
}
