package com.paperbukit.checkin.data.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.paperbukit.checkin.data.model.AttendanceRecord
import com.paperbukit.checkin.data.model.AttendanceStatus
import kotlinx.coroutines.flow.Flow

data class SubjectAttendanceStats(
    val subjectId: Int,
    val totalClasses: Int,
    val presentClasses: Int,
    val absentClasses: Int,
    val cancelledClasses: Int
)

@Dao
interface AttendanceDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAttendance(record: AttendanceRecord)

    @Query("SELECT * FROM attendance_records WHERE subjectId = :subjectId ORDER BY timestamp DESC")
    fun getAttendanceForSubject(subjectId: Int): Flow<List<AttendanceRecord>>

    @Query("SELECT * FROM attendance_records WHERE timestamp BETWEEN :startTime AND :endTime")
    fun getAttendanceBetweenDates(startTime: Long, endTime: Long): Flow<List<AttendanceRecord>>
    
    // Simple stats query - can be more complex effectively
    @Query("SELECT COUNT(*) FROM attendance_records WHERE subjectId = :subjectId AND status = :status")
    suspend fun getCountForSubjectAndStatus(subjectId: Int, status: AttendanceStatus): Int

    @Query("SELECT COUNT(*) FROM attendance_records WHERE subjectId = :subjectId AND status != 'CANCELLED'")
    suspend fun getTotalClassesForSubject(subjectId: Int): Int
}
