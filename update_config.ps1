$manifestPath = "android/app/src/main/AndroidManifest.xml"
$manifest = Get-Content $manifestPath -Raw

# Add permissions
$permissions = @"
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
"@

if (-not ($manifest -match "android.permission.INTERNET")) {
    $manifest = $manifest -replace "<application", "$permissions`n<application"
}

# Update application tag
$manifest = $manifest -replace "<application", "<application android:usesCleartextTraffic=`"true`" android:networkSecurityConfig=`"@xml/network_security_config`""

Set-Content -Path $manifestPath -Value $manifest

# Build.gradle
$gradlePath = "android/app/build.gradle"
$gradle = Get-Content $gradlePath -Raw

# Add NDK filter
if (-not ($gradle -match "abiFilters")) {
    $gradle = $gradle -replace "versionName `"1.0`"", "versionName `"1.0`"`n        ndk { abiFilters `"armeabi-v7a`", `"arm64-v8a`" }"
}

# Add packaging options
$packaging = @"
    packagingOptions {
        pickFirst '**/*.so'
        pickFirst 'lib/x86/libc++_shared.so'
        pickFirst 'lib/x86_64/libc++_shared.so'
        pickFirst 'lib/armeabi-v7a/libc++_shared.so'
        pickFirst 'lib/arm64-v8a/libc++_shared.so'
    }
"@

if (-not ($gradle -match "packagingOptions")) {
    $gradle = $gradle -replace "android {", "android {`n$packaging"
}

Set-Content -Path $gradlePath -Value $gradle
