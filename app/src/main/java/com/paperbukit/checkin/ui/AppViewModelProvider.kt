package com.paperbukit.checkin.ui

import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.createSavedStateHandle
import androidx.lifecycle.viewmodel.CreationExtras
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.paperbukit.checkin.CheckInApplication
import com.paperbukit.checkin.ui.screens.HomeViewModel
import com.paperbukit.checkin.ui.screens.SubjectDetailViewModel
import com.paperbukit.checkin.ui.screens.SubjectEntryViewModel
import com.paperbukit.checkin.ui.screens.TimetableViewModel

object AppViewModelProvider {
    val Factory = viewModelFactory {
        initializer {
            SubjectEntryViewModel(checkInApplication().container.repository)
        }
        initializer {
            HomeViewModel(checkInApplication().container.repository)
        }
        initializer {
            TimetableViewModel(checkInApplication().container.repository)
        }
        initializer {
            SubjectDetailViewModel(
                this.createSavedStateHandle(),
                checkInApplication().container.repository
            )
        }
    }
}

fun CreationExtras.checkInApplication(): CheckInApplication =
    (this[ViewModelProvider.AndroidViewModelFactory.APPLICATION_KEY] as CheckInApplication)
