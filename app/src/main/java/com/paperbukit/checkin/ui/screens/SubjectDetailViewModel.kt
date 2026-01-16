package com.paperbukit.checkin.ui.screens

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.paperbukit.checkin.data.CheckInRepository
import com.paperbukit.checkin.data.model.AttendanceRecord
import com.paperbukit.checkin.data.model.AttendanceStatus
import com.paperbukit.checkin.data.model.Subject
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.filterNotNull
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class SubjectDetailUiState(
    val subject: Subject? = null,
    val attendanceHistory: List<AttendanceRecord> = emptyList(),
    val presentCount: Int = 0,
    val totalClasses: Int = 0
) {
    val currentPercentage: Float
        get() = if (totalClasses > 0) (presentCount.toFloat() / totalClasses.toFloat()) * 100 else 0f
}

class SubjectDetailViewModel(
    savedStateHandle: SavedStateHandle,
    private val repository: CheckInRepository
) : ViewModel() {
    private val subjectId: Int = checkNotNull(savedStateHandle["subjectId"])

    private val _subjectStream = repository.allSubjects
        .map { subjects -> subjects.find { it.id == subjectId } }
        .filterNotNull()

    private val _attendanceStream = repository.getAttendanceForSubject(subjectId)

    // Combining flows is better, but for simplicity let's just collect in init or use simple mapping
    // This is a simplified state stream
    val uiState: StateFlow<SubjectDetailUiState> = 
        kotlinx.coroutines.flow.combine(_subjectStream, _attendanceStream) { subject, history ->
            val present = history.count { it.status == AttendanceStatus.PRESENT }
            val total = history.count { it.status != AttendanceStatus.CANCELLED }
            SubjectDetailUiState(subject, history, present, total)
        }.stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = SubjectDetailUiState()
        )

    fun markAttendance(status: AttendanceStatus) {
        viewModelScope.launch {
            val record = AttendanceRecord(
                subjectId = subjectId,
                timestamp = System.currentTimeMillis(),
                status = status
            )
            repository.markAttendance(record)
        }
    }
}
