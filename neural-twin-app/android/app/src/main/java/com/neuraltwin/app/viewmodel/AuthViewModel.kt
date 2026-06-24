package com.neuraltwin.app.viewmodel

import androidx.lifecycle.ViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import javax.inject.Inject

data class User(
    val id: String,
    val email: String,
    val name: String,
    val avatar: String? = null,
)

@HiltViewModel
class AuthViewModel @Inject constructor() : ViewModel() {
    private val _isAuthenticated = MutableStateFlow(false)
    val isAuthenticated: StateFlow<Boolean> = _isAuthenticated

    private val _user = MutableStateFlow<User?>(null)
    val user: StateFlow<User?> = _user

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    fun login(email: String, password: String) {
        // TODO: Call backend API
        _isLoading.value = true
        _error.value = null
        // Simulated successful login for now
        _user.value = User(
            id = "user-123",
            email = email,
            name = email.substringBefore("@")
        )
        _isAuthenticated.value = true
        _isLoading.value = false
    }

    fun signup(email: String, password: String, name: String) {
        // TODO: Call backend API
        _isLoading.value = true
        _error.value = null
        _user.value = User(
            id = "user-new",
            email = email,
            name = name
        )
        _isAuthenticated.value = true
        _isLoading.value = false
    }

    fun logout() {
        // TODO: Clear local data and call backend logout
        _isAuthenticated.value = false
        _user.value = null
        _error.value = null
    }
}
