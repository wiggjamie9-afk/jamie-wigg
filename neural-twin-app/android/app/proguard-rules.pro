# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.kts.
#
# For more details, see
#   https://developer.android.com/guide/developing/tools/proguard

# Preserve line numbers for debugging stack traces
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# === Hilt / Dagger ===
-keep class dagger.hilt.** { *; }
-keep @dagger.hilt.android.HiltAndroidApp class * { <init>(); }
-keep @dagger.hilt.android.AndroidEntryPoint class * { <init>(); }
-keepclasseswithmembernames class * {
    @dagger.hilt.* *;
}

# === Retrofit ===
-keep class retrofit2.** { *; }
-keep interface retrofit2.** { *; }
-keepattributes Signature
-keepattributes Exceptions
-keepclasseswithmembers class * {
    @retrofit2.http.<*> <methods>;
}

# === Gson ===
-keep class com.google.gson.** { *; }
-keep interface com.google.gson.** { *; }
-keepattributes Signature
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}

# === OkHttp ===
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-keepnames class okhttp3.internal.publicsuffix.PublicSuffixDatabase

# === Room Database ===
-keep class androidx.room.** { *; }
-keep interface androidx.room.** { *; }
-keepclasseswithmembernames class * {
    @androidx.room.* <methods>;
}
-keepclasseswithmembernames class * {
    @androidx.room.* <fields>;
}

# === Kotlin Coroutines ===
-keepclassmembers class kotlinx.coroutines.** {
    volatile <fields>;
}

# === Android Core ===
-keepclasseswithmembernames class * {
    native <methods>;
}

# === Application Classes ===
# Keep all classes in our app package (adjust package name as needed)
-keep class com.neuraltwin.app.** { *; }

# === Generic Optimization ===
-optimizations !code/simplification/arithmetic,!code/simplification/cast,!field/*,!class/merging/*
-optimizationpasses 5
-allowaccessmodification
-dontpreverify

# === Verbose Output ===
-verbose
