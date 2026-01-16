package com.paperbukit.checkin.data.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.paperbukit.checkin.data.model.TimetableEntry
import kotlinx.coroutines.flow.Flow

@Dao
interface TimetableDao {
    @Query("SELECT * FROM timetable_entries WHERE dayOfWeek = :dayOfWeek ORDER BY startTime ASC")
    fun getClassesForDay(dayOfWeek: Int): Flow<List<TimetableEntry>>

    @Query("SELECT * FROM timetable_entries WHERE subjectId = :subjectId")
    fun getTimetableForSubject(subjectId: Int): Flow<List<TimetableEntry>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTimetableEntry(entry: TimetableEntry)

    @Delete
    suspend fun deleteTimetableEntry(entry: TimetableEntry)
}
