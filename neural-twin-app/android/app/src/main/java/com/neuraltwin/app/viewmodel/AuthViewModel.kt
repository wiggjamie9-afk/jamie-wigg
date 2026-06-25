package com.neuraltwin.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.neuraltwin.app.data.models.LoginRequest
import com.neuraltwin.app.data.models.RegisterRequest
import com.neuraltwin.app.data.network.Repository
import com.neuraltwin.app.data.network.TokenStore
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import retrofit2.Response
import javax.inject.Inject

data class User(
    val id: String,
    val email: String,
    val name: String,
    val avatar: String? = null,
)

@HiltViewModel
class AuthViewModel @Inject constructor(
    private val repository: Repository
) : ViewModel() {
    private val _isAuthenticated = MutableStateFlow(false)
    val isAuthenticated: StateFlow<Boolean> = _isAuthenticated

    private val _user = MutableStateFlow<User?>(null)
    val user: StateFlow<User?> = _user

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    init {
        // Restore a previously persisted session so a returning user lands
        // straight on the app rather than the login screen.
        if (TokenStore.isLoggedIn) {
            _user.value = User(
                id = TokenStore.userId.orEmpty(),
                email = TokenStore.email.orEmpty(),
                name = TokenStore.name.orEmpty()
            )
            _isAuthenticated.value = true
        }
    }

    fun login(email: String, password: String) {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            try {
                handleAuthResponse(repository.login(LoginRequest(email, password)))
            } catch (e: Exception) {
                _error.value = networkError(e)
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun signup(email: String, password: String, name: String) {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            try {
                handleAuthResponse(repository.register(RegisterRequest(email, password, name)))
            } catch (e: Exception) {
                _error.value = networkError(e)
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun logout() {
        TokenStore.clear()
        _isAuthenticated.value = false
        _user.value = null
        _error.value = null
    }

    /** Clears the last error — call after the UI has shown it. */
    fun clearError() {
        _error.value = null
    }

    private fun handleAuthResponse(response: Response<com.neuraltwin.app.data.models.AuthResponse>) {
        val body = response.body()
        if (response.isSuccessful && body != null) {
            TokenStore.saveSession(
                token = body.token,
                userId = body.user.id,
                email = body.user.email,
                name = body.user.name
            )
            _user.value = User(
                id = body.user.id,
                email = body.user.email,
                name = body.user.name
            )
            _isAuthenticated.value = true
        } else {
            _error.value = when (response.code()) {
                401 -> "Invalid email or password."
                409 -> "An account with that email already exists."
                400 -> "Please check your details and try again."
                else -> "Something went wrong (${response.code()}). Please try again."
            }
        }
    }

    private fun networkError(e: Exception): String =
        "Can't reach the server. Check your connection and that the backend is running. (${e.message})"
}
