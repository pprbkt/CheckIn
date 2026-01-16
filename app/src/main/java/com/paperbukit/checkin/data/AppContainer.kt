package com.paperbukit.checkin.data

import android.content.Context

interface AppContainer {
    val repository: CheckInRepository
}

class AppDataContainer(private val context: Context) : AppContainer {
    override val repository: CheckInRepository by lazy {
        val database = CheckInDatabase.getDatabase(context)
        CheckInRepository(database.subjectDao(), database.attendanceDao(), database.timetableDao())
    }
}
