# How to Build CheckIn Android App

To run this app on your phone and generate an APK, follow these steps:

## Prerequisites
1.  Download and install **Android Studio** (it includes the necessary SDKs and build tools).

## Steps to Build & Run
1.  **Unzip** the `checkin_android_project.zip` file.
2.  Open **Android Studio**.
3.  Select **Open** and choose the `checkin_android_project` folder (the one containing `build.gradle.kts`).
4.  Wait for Android Studio to sync the project (it might download some dependencies).
5.  **Connect your Android Phone** to your computer via USB (make sure "USB Debugging" is enabled in your phone's Developer Options).
6.  Click the green **Run (Play)** button in the top toolbar of Android Studio.

## Generating a Standalone APK
If you want to share the file without connecting a phone:
1.  Go to `Build` > `Build Bundles(s) / APK(s)` > `Build APK(s)`.
2.  Once finished, a notification will appear. Click `locate` to find the `.apk` file.
3.  Transfer this file to your phone and install it.

## Data Persistence
This app uses a WebView to run the application. Your data (subjects, attendance) is stored in your phone's local storage within the app. It will persist even if you close the app or restart your phone.
