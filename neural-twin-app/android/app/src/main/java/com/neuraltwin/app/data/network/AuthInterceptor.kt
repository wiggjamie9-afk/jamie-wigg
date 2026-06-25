package com.neuraltwin.app.data.network

import okhttp3.Interceptor
import okhttp3.Response

/**
 * Attaches the stored JWT as a Bearer token on every outbound request, so the
 * backend's requireAuth middleware accepts it. Skips the auth endpoints
 * (register/login/oauth) which must be reachable before a token exists.
 *
 * The backend derives the acting user from this token (req.userId), so the
 * client never needs to — and must not be trusted to — supply its own user id.
 */
class AuthInterceptor : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request()

        val isAuthRoute = request.url.encodedPath.contains("/auth/")
        val token = TokenStore.token

        if (isAuthRoute || token.isNullOrBlank()) {
            return chain.proceed(request)
        }

        val authed = request.newBuilder()
            .header("Authorization", "Bearer $token")
            .build()
        return chain.proceed(authed)
    }
}
