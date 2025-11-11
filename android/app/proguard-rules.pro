# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# MapLibre / MapTiler - Prevent class stripping
-keep class org.maplibre.** { *; }
-keep class com.mapbox.** { *; }
-keep class com.maptiler.** { *; }
-keep class com.google.gson.** { *; }
-dontwarn org.maplibre.**
-dontwarn com.mapbox.**
-dontwarn com.maptiler.**

# Keep native methods
-keepclassmembers class * {
    native <methods>;
}

# Add any project specific keep options here:
