# CheckIn

A mobile application for tracking student attendance and managing subject records. CheckIn provides an intuitive interface for recording and managing attendance data locally on your device.

## Features

- 📱 **Mobile-First Design** - Built with Jetpack Compose for a modern, responsive UI
- 💾 **Local Data Storage** - All attendance and subject data is stored securely on your device using Room database
- 🏷️ **Subject Management** - Easily create and manage multiple subjects
- ✅ **Attendance Tracking** - Record and track attendance for each subject
- 📊 **Persistent Data** - Data persists even after closing the app or restarting your phone

## Technology Stack

- **Language**: Kotlin
- **UI Framework**: Jetpack Compose
- **Database**: Android Room
- **Navigation**: Jetpack Navigation Compose
- **Build Tool**: Gradle
- **Min SDK**: Android 7.0 (API 24)
- **Target SDK**: Android 14 (API 34)

## Getting Started

### Prerequisites

- Android Studio (Giraffe or later recommended)
- Android 7.0 or higher on your device
- USB cable to connect your device

### Installation & Running

1. **Open the project in Android Studio**
   - Click "Open" and navigate to the `CheckIn` folder
   - Wait for Android Studio to sync and download dependencies

2. **Connect your Android device**
   - Enable USB Debugging in Developer Options (Settings → About Phone → Build Number, tap 7 times)
   - Connect via USB cable

3. **Run the app**
   - Click the green **Run (Play)** button in the toolbar
   - Select your connected device
   - Android Studio will build and install the app

### Building an APK

To create a standalone APK file for distribution:

1. Go to **Build** → **Build Bundles(s) / APK(s)** → **Build APK(s)**
2. Wait for the build to complete
3. Click **locate** in the notification to find the generated APK
4. Transfer the APK to your device and tap to install

## Project Structure

```
CheckIn/
├── app/
│   ├── src/main/
│   │   ├── java/com/paperbukit/checkin/
│   │   │   ├── CheckInApplication.kt      # Application class
│   │   │   ├── MainActivity.kt             # Main activity entry point
│   │   │   ├── data/                       # Database and data layer
│   │   │   └── ui/                         # UI components (Jetpack Compose)
│   │   ├── res/                            # Resources (layouts, strings, drawables)
│   │   └── AndroidManifest.xml
│   ├── build.gradle.kts                    # App-level build configuration
├── build.gradle.kts                        # Project-level build configuration
├── gradle/
│   └── libs.versions.toml                  # Dependency versions
└── README.md
```

## Data Persistence

CheckIn uses Android's **Room Database** to persist all user data locally on the device:

- ✅ Data survives app closure
- ✅ Data survives device restart
- ✅ Data is isolated to the app (not backed up to cloud by default)
- ✅ Data is removed only when the app is uninstalled

## Development

### Building from Command Line

```bash
./gradlew build        # Build the project
./gradlew assembleDebug # Build debug APK
```

### Required Java Version

- Java 1.8 (JDK 8 or later)

### Dependencies

Key dependencies are managed in `gradle/libs.versions.toml`:
- androidx.room.*
- androidx.compose.*
- androidx.navigation.*
- androidx.lifecycle.*

## Version Information

- **Current Version**: 1.0
- **Application ID**: com.paperbukit.checkin
- **Package Name**: com.paperbukit.checkin

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Project sync fails | Clear cache: File → Invalidate Caches → Restart |
| APK won't install | Uninstall previous version first |
| USB debugging not recognized | Update USB drivers and enable Developer Options |
| Build fails | Run `./gradlew clean build` |

## License

This project is provided as-is for educational and personal use.

## Support

For issues or feature requests, please contact the development team.
