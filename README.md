# CheckIn

Minimalist attendance tracker for students — record and monitor attendance per subject, stored locally, to keep an eye on minimum attendance criteria.

## ▌Overview

A local-first attendance app. Add subjects, log attendance per class, and the data persists on-device through app restarts and reboots — no account, no cloud sync, no backend.

## ▌Tech Stack

```
Language     Kotlin
UI           Jetpack Compose
Database     Room (local)
Navigation   Jetpack Navigation Compose
Build        Gradle
Min/Target   SDK 24 (Android 7.0) / SDK 34 (Android 14)
```

## ▌Features

- Subject management — create and manage multiple subjects
- Attendance tracking — log attendance per subject
- Local persistence via Room — survives app close and device restart
- Data is on-device only, removed on uninstall

## ▌Project Structure

```
CheckIn/
├── app/
│   ├── src/main/
│   │   ├── java/com/paperbukit/checkin/
│   │   │   ├── CheckInApplication.kt   Application class
│   │   │   ├── MainActivity.kt         Entry point
│   │   │   ├── data/                   Room database, data layer
│   │   │   └── ui/                     Compose UI
│   │   ├── res/
│   │   └── AndroidManifest.xml
│   └── build.gradle.kts
├── build.gradle.kts
├── gradle/libs.versions.toml            Dependency versions
└── README.md
```

## ▌Run

```bash
git clone https://github.com/pprbkt/CheckIn.git
```

Open in Android Studio (Giraffe+), let Gradle sync, connect a device with USB debugging on (or use an emulator), hit Run.

Command line:

```bash
./gradlew assembleDebug
```

## ▌Build an APK

`Build → Build Bundle(s) / APK(s) → Build APK(s)`, then locate and install on-device.

## ▌Info

```
Version          1.0
Application ID   com.paperbukit.checkin
Java             JDK 8+
```

## ▌Troubleshooting

| Issue | Fix |
|---|---|
| Sync fails | File → Invalidate Caches → Restart |
| APK won't install | Uninstall the previous version first |
| Build fails | `./gradlew clean build` |

## ▌License

Educational and personal use.
