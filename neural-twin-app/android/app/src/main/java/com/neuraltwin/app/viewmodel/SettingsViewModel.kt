package com.neuraltwin.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.neuraltwin.app.data.models.AuthUser
import com.neuraltwin.app.data.local.TokenStore
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SettingsViewModel @Inject constructor(
    private val tokenStore: TokenStore
) : ViewModel() {
    private val _user = MutableStateFlow<AuthUser?>(null)
    val user: StateFlow<AuthUser?> = _user

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    init {
        loadUserInfo()
    }

    private fun loadUserInfo() {
        viewModelScope.launch {
            try {
                _isLoading.value = true
                val userData = tokenStore.getUser()
                userData?.let {
                    _user.value = AuthUser(
                        id = it["id"] as? String ?: "",
                        email = it["email"] as? String ?: "",
                        name = it["name"] as? String ?: ""
                    )
                }
            } catch (e: Exception) {
                _error.value = "Error loading user info: ${e.localizedMessage}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun logout() {
        viewModelScope.launch {
            try {
                tokenStore.clearToken()
                _user.value = null
            } catch (e: Exception) {
                _error.value = "Error logging out: ${e.localizedMessage}"
            }
        }
    }

    fun clearError() {
        _error.value = null
    }
}
