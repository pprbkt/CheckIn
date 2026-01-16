package com.paperbukit.checkin.ui.screens

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import com.paperbukit.checkin.data.CheckInRepository
import com.paperbukit.checkin.data.model.Subject

class SubjectEntryViewModel(private val repository: CheckInRepository) : ViewModel() {
    var subjectUiState by mutableStateOf(SubjectUiState())
        private set

    fun updateUiState(newSubjectUiState: SubjectUiState) {
        subjectUiState = newSubjectUiState.copy( actionEnabled = newSubjectUiState.isValid())
    }

    suspend fun saveSubject() {
        if (subjectUiState.isValid()) {
            repository.insertSubject(subjectUiState.toSubject())
        }
    }
}

data class SubjectUiState(
    val name: String = "",
    val minAttendance: String = "75.0",
    val actionEnabled: Boolean = false
) {
    fun isValid(): Boolean {
        return name.isNotBlank() && minAttendance.isNotBlank() && minAttendance.toDoubleOrNull() != null
    }
    fun toSubject(): Subject = Subject(
        name = name,
        minAttendancePercent = minAttendance.toFloatOrNull() ?: 75.0f
    )
}
