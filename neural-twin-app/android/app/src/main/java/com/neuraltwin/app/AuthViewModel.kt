package com.neuraltwin.app

import androidx.lifecycle.ViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject

@HiltViewModel
class AuthViewModel @Inject constructor() : ViewModel() {
    private val _isAuthenticated = MutableStateFlow(false)
    val isAuthenticated: StateFlow<Boolean> = _isAuthenticated.asStateFlow()

    private val _user = MutableStateFlow<User?>(null)
    val user: StateFlow<User?> = _user.asStateFlow()

    fun login(email: String, password: String) {
        // TODO: Call backend API
        _isAuthenticated.value = true
    }

    fun loginWithGoogle() {
        // TODO: Implement Google Sign-in
    }

    fun loginWithApple() {
        // TODO: Implement Apple Sign-in
    }

    fun logout() {
        _isAuthenticated.value = false
        _user.value = null
    }
}

data class User(
    val id: String,
    val email: String,
    val name: String
)
