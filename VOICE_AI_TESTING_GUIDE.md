# Voice AI Testing Guide - Android Emulator

## ✅ FIXES APPLIED

### 1. **Added Microphone Permissions**
- ✅ Added `RECORD_AUDIO` permission to `app.json` (Android)
- ✅ Added `NSMicrophoneUsageDescription` to `app.json` (iOS)
- ✅ Android Manifest already had `RECORD_AUDIO` permission

### 2. **Enhanced Permission Request Flow**
- ✅ Added detailed logging for permission requests
- ✅ Check current permission status before requesting
- ✅ Better error messages when permission is denied
- ✅ Enhanced error logging with full error details

### 3. **Improved Audio Recording**
- ✅ Added `staysActiveInBackground: false` to audio mode
- ✅ Better console logging at each step
- ✅ Detailed error reporting

---

## 🔧 REBUILD REQUIRED

**IMPORTANT:** Since we modified `app.json` and added new permissions, you MUST rebuild the Android app:

```bash
# Stop the current app
# Then rebuild:
npx expo run:android
```

This will:
1. Regenerate the Android manifest with new permissions
2. Rebuild the native code
3. Install the updated app on the emulator

---

## 🎤 ANDROID EMULATOR MICROPHONE SETUP

### Option 1: Use Computer Microphone (Recommended)
1. Open Android Studio
2. Go to **Tools → AVD Manager**
3. Click the **Edit** (pencil icon) for your emulator
4. Click **Show Advanced Settings**
5. Scroll to **Camera** section
6. Set **Microphone** to **Host audio input** (uses your computer's mic)
7. Click **Finish**
8. Restart the emulator

### Option 2: Use Virtual Audio File
1. In the emulator, go to **Settings → Extended controls** (three dots on the side)
2. Select **Microphone**
3. Choose **Virtual microphone uses host audio input**

### Option 3: Command Line (When Starting Emulator)
```bash
emulator -avd YOUR_AVD_NAME -qemu -audiodev id=host,driver=dsound
```

---

## 🧪 TESTING STEPS

### Step 1: Verify Microphone Access
1. Open the emulator's **Settings**
2. Go to **Apps → Plot My Farm → Permissions**
3. Verify that **Microphone** permission is listed
4. If not listed, the app needs to be rebuilt

### Step 2: Test Voice Recording
1. Launch the app in the emulator
2. Navigate to **Voice AI** screen (from farmer or buyer home)
3. Click the **microphone button** (bottom right)
4. **Expected behavior:**
   - Permission dialog should appear (first time only)
   - Click "Allow" or "While using the app"
   - Button should turn RED
   - "Listening..." text should appear
5. **Speak clearly** into your computer's microphone
6. After 5 seconds (or click again), recording stops
7. Check the console logs for:
   ```
   📋 Requesting audio permissions...
   ✅ Audio permission granted
   🎤 Starting voice recording...
   🔧 Setting audio mode...
   🎙️ Creating recording instance...
   ✅ Voice recording started successfully
   ✅ Recording stopped, URI: file://...
   🎤 Transcribing audio with Gemini...
   ✅ Transcription successful: [your text]
   ```

### Step 3: Verify Transcription
1. After recording, you should see:
   - Your transcribed text in a **blue bubble** (user message)
   - "Thinking..." indicator
   - AI response in a **white bubble**
   - Female voice speaking the response

---

## 🐛 TROUBLESHOOTING

### Issue: Permission Dialog Doesn't Appear
**Solution:**
1. Uninstall the app from emulator
2. Rebuild with `npx expo run:android`
3. Fresh install will trigger permission dialog

### Issue: "Permission Denied" Error
**Solution:**
1. Go to emulator **Settings → Apps → Plot My Farm → Permissions**
2. Manually enable **Microphone** permission
3. Restart the app

### Issue: Recording Starts But No Audio Captured
**Solution:**
1. Check if your computer's microphone is working (test in another app)
2. Verify emulator microphone settings (see setup above)
3. Try restarting the emulator
4. Check console for error messages

### Issue: "Audio recording permission not granted"
**Solution:**
1. Check console logs for permission status
2. Manually grant permission in Settings
3. Rebuild the app if permission is not listed

### Issue: Transcription Returns Mock Text
**Solution:**
1. Verify Gemini API key is configured in `.env` or `app.json`
2. Check console for Gemini initialization messages
3. Verify internet connection in emulator

---

## 📱 TESTING ON REAL DEVICE

For best results, test on a real Android device:

1. Enable **Developer Mode** on your Android phone
2. Enable **USB Debugging**
3. Connect phone via USB
4. Run: `npx expo run:android --device`
5. The app will install on your phone
6. Test voice recording with your phone's microphone

---

## 📊 EXPECTED CONSOLE OUTPUT

```
📋 Requesting audio permissions...
Current permission status: undetermined
Permission request result: granted
✅ Audio permission granted
🎤 Starting voice recording...
🔧 Setting audio mode...
🎙️ Creating recording instance...
✅ Voice recording started successfully
✅ Recording stopped, URI: file:///data/user/0/com.ajaypamarthi.myapp/cache/Audio/recording-XXXXX.m4a
🎤 Transcribing audio with Gemini...
🔄 Trying model: gemini-2.0-flash-exp
✅ Transcription successful: What is the market price for tomatoes?
🤖 Processing user input: What is the market price for tomatoes?
💬 AI Response: The current market price for tomatoes varies by region...
🔊 Speaking response...
```

---

## ✅ SUCCESS CRITERIA

- [ ] Permission dialog appears on first mic button click
- [ ] Microphone permission is granted
- [ ] Recording starts (red button, "Listening..." text)
- [ ] Recording stops after 5 seconds
- [ ] Audio is transcribed to text using Gemini
- [ ] Transcribed text appears in chat
- [ ] AI generates response
- [ ] Female voice speaks the response
- [ ] All console logs show success messages

---

## 🔄 NEXT STEPS AFTER TESTING

Once voice recording works:
1. Test in all 5 languages (EN, HI, TE, TA, KN)
2. Test with different voice commands
3. Test with background noise
4. Test on real device for best accuracy
5. Add voice agent translations to remaining languages (TE, TA, KN)

