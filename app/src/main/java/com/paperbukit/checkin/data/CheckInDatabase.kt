package com.paperbukit.checkin.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.paperbukit.checkin.data.dao.AttendanceDao
import com.paperbukit.checkin.data.dao.SubjectDao
import com.paperbukit.checkin.data.dao.TimetableDao
import com.paperbukit.checkin.data.model.AttendanceRecord
import com.paperbukit.checkin.data.model.Subject
import com.paperbukit.checkin.data.model.TimetableEntry

@Database(
    entities = [Subject::class, AttendanceRecord::class, TimetableEntry::class],
    version = 1,
    exportSchema = false
)
abstract class CheckInDatabase : RoomDatabase() {
    abstract fun subjectDao(): SubjectDao
    abstract fun attendanceDao(): AttendanceDao
    abstract fun timetableDao(): TimetableDao

    companion object {
        @Volatile
        private var Instance: CheckInDatabase? = null

        fun getDatabase(context: Context): CheckInDatabase {
            return Instance ?: synchronized(this) {
                Room.databaseBuilder(context, CheckInDatabase::class.java, "checkin_database")
                    .fallbackToDestructiveMigration()
                    .build()
                    .also { Instance = it }
            }
        }
    }
}
