package com.paperbukit.checkin.ui.screens

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.paperbukit.checkin.data.CheckInRepository
import com.paperbukit.checkin.data.model.Subject
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn

data class HomeUiState(
    val subjectList: List<Subject> = listOf()
)

class HomeViewModel(private val repository: CheckInRepository) : ViewModel() {
    val homeUiState: StateFlow<HomeUiState> = repository.allSubjects.map { HomeUiState(it) }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = HomeUiState()
        )
}
