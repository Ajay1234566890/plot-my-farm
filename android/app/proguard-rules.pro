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

# Add any project specific keep options here:

# ========================================
# MapLibre + MapTiler JNI Protection
# ========================================
# CRITICAL: Keep all MapLibre classes to prevent JNI crashes in release builds
-keep class org.maplibre.** { *; }
-keep class com.mapbox.** { *; }
-keep class com.maptiler.** { *; }
-dontwarn org.maplibre.**
-dontwarn com.mapbox.**
-dontwarn com.maptiler.**

# Keep all native methods (required for JNI)
-keepclassmembers class * {
    native <methods>;
}

# Keep MapLibre annotations
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes Exceptions

# Keep Geolocation classes
-keep class com.facebook.react.modules.location.** { *; }
-keep class com.reactnativecommunity.geolocation.** { *; }
