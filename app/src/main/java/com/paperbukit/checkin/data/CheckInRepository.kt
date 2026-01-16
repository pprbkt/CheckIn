package com.paperbukit.checkin.data

import com.paperbukit.checkin.data.dao.AttendanceDao
import com.paperbukit.checkin.data.dao.SubjectDao
import com.paperbukit.checkin.data.dao.TimetableDao
import com.paperbukit.checkin.data.model.AttendanceRecord
import com.paperbukit.checkin.data.model.AttendanceStatus
import com.paperbukit.checkin.data.model.Subject
import com.paperbukit.checkin.data.model.TimetableEntry
import kotlinx.coroutines.flow.Flow

class CheckInRepository(
    private val subjectDao: SubjectDao,
    private val attendanceDao: AttendanceDao,
    private val timetableDao: TimetableDao
) {
    // Subject Operations
    val allSubjects: Flow<List<Subject>> = subjectDao.getAllSubjects()

    suspend fun getSubject(id: Int): Subject? = subjectDao.getSubjectById(id)
    suspend fun insertSubject(subject: Subject) = subjectDao.insertSubject(subject)
    suspend fun updateSubject(subject: Subject) = subjectDao.updateSubject(subject)
    suspend fun deleteSubject(subject: Subject) = subjectDao.deleteSubject(subject)

    // Attendance Operations
    fun getAttendanceForSubject(subjectId: Int): Flow<List<AttendanceRecord>> = attendanceDao.getAttendanceForSubject(subjectId)
    
    suspend fun markAttendance(record: AttendanceRecord) = attendanceDao.insertAttendance(record)
    
    suspend fun getSubjectStats(subjectId: Int): Triple<Int, Int, Int> {
        // Returns (Present, Absent, Total)
        // This is a simplification. Real apps might use a more complex query or Flow.
        val present = attendanceDao.getCountForSubjectAndStatus(subjectId, AttendanceStatus.PRESENT)
        val absent = attendanceDao.getCountForSubjectAndStatus(subjectId, AttendanceStatus.ABSENT)
        val total = attendanceDao.getTotalClassesForSubject(subjectId)
        return Triple(present, absent, total)
    }

    // Timetable Operations
    fun getClassesForDay(dayOfWeek: Int): Flow<List<TimetableEntry>> = timetableDao.getClassesForDay(dayOfWeek)
    suspend fun insertTimetableEntry(entry: TimetableEntry) = timetableDao.insertTimetableEntry(entry)
    suspend fun deleteTimetableEntry(entry: TimetableEntry) = timetableDao.deleteTimetableEntry(entry)
}
