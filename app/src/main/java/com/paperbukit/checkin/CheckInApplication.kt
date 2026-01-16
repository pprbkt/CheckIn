package com.paperbukit.checkin

import android.app.Application
import com.paperbukit.checkin.data.AppContainer
import com.paperbukit.checkin.data.AppDataContainer

class CheckInApplication : Application() {
    lateinit var container: AppContainer

    override fun onCreate() {
        super.onCreate()
        container = AppDataContainer(this)
    }
}
