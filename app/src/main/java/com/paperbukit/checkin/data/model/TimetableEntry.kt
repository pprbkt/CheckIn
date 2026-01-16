package com.paperbukit.checkin.data.model

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "timetable_entries",
    foreignKeys = [
        ForeignKey(
            entity = Subject::class,
            parentColumns = ["id"],
            childColumns = ["subjectId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [Index("subjectId")]
)
data class TimetableEntry(
    @PrimaryKey(autoGenerate = true)
    val id: Int = 0,
    val subjectId: Int,
    val dayOfWeek: Int, // 1 = Sunday, 2 = Monday, ... 7 = Saturday (Java Calendar standard)
    val startTime: String, // Format "HH:mm" 24h
    val endTime: String // Format "HH:mm" 24h
)
