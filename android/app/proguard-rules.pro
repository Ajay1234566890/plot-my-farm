# Keep MapLibre and JNI bindings
-keep class org.maplibre.** { *; }
-keep class com.mapbox.** { *; }
-keep class com.maptiler.** { *; }
-dontwarn org.maplibre.**
-dontwarn com.mapbox.**
-dontwarn com.maptiler.**

# Keep React Native bridge & SoLoader
-keep class com.facebook.react.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.soloader.** { *; }
-dontwarn com.facebook.react.**

# Prevent removing native methods
-keepclassmembers class * {
    native <methods>;
}
