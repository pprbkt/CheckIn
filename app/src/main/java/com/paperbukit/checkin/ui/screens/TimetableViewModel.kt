package com.paperbukit.checkin.ui.screens

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.paperbukit.checkin.data.CheckInRepository
import com.paperbukit.checkin.data.model.TimetableEntry
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn

data class TimetableUiState(
    val dayOneClasses: List<TimetableEntry> = emptyList(), // Sunday
    val dayTwoClasses: List<TimetableEntry> = emptyList() // Monday, etc. Simplified for now
)

class TimetableViewModel(private val repository: CheckInRepository) : ViewModel() {
    // In a real app we'd probably have a selection for day, or load all.
    // For simplicity, let's just expose a flow for a specific day or all.
    // Let's just create a placeholder view model for now as the main requirement is showing "Today's Classes" on Home.
    // Implementation of full timetable editing is a larger task.
}
