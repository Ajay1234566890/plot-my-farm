# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# ===== MAPLIBRE NATIVE =====
# Keep all MapLibre classes and methods
-keep class org.maplibre.** { *; }
-keep class com.mapbox.** { *; }
-keep class com.maptiler.** { *; }
-dontwarn org.maplibre.**
-dontwarn com.mapbox.**
-dontwarn com.maptiler.**

# Keep MapLibre JNI methods
-keepclassmembers class org.maplibre.** {
    native <methods>;
}

# ===== REACT NATIVE =====
# Keep React Native bridge classes
-keep class com.facebook.react.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.soloader.** { *; }
-keep class com.facebook.hermes.** { *; }
-dontwarn com.facebook.react.**
-dontwarn com.facebook.jni.**

# Keep all native methods (critical for JNI)
-keepclassmembers class * {
    native <methods>;
}

# Keep React Native module classes
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep,allowobfuscation @interface com.facebook.common.internal.DoNotStrip

-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keep @com.facebook.common.internal.DoNotStrip class *
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
    @com.facebook.common.internal.DoNotStrip *;
}

-keepclassmembers @com.facebook.proguard.annotations.KeepGettersAndSetters class * {
  void set*(***);
  *** get*();
}

# ===== EXPO =====
-keep class expo.modules.** { *; }
-dontwarn expo.modules.**

# ===== OKHTTP =====
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn javax.annotation.**
-dontwarn org.conscrypt.**
-keepnames class okhttp3.internal.publicsuffix.PublicSuffixDatabase

# ===== GSON =====
-keepattributes Signature
-keepattributes *Annotation*
-dontwarn sun.misc.**
-keep class com.google.gson.** { *; }
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer

# ===== GENERAL =====
# Keep line numbers for debugging stack traces
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# Keep annotations
-keepattributes *Annotation*

# Keep generic signatures
-keepattributes Signature

# Keep exceptions
-keepattributes Exceptions

