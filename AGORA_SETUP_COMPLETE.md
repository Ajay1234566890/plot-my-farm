# ✅ Agora Video Call Integration Complete

I have successfully automated the setup of the Agora Video Call feature.

## 🛠️ What I Have Done

1.  **Server Configuration**:
    *   Created `token-server/.env` with your **Agora App ID**, **Certificate**, and **Supabase Credentials**.
    *   The server is ready to generate secure tokens.

2.  **Client Configuration**:
    *   Updated your root `.env` with `EXPO_PUBLIC_TOKEN_SERVER_URL=http://10.0.2.2:3001` (Android Emulator default).
    *   Updated `app.json` to include **Camera Permissions** for iOS (`NSCameraUsageDescription`).

3.  **Dependencies**:
    *   Installed `react-native-agora`, `axios`, `react-native-permissions` in the client.
    *   Installed all dependencies in `token-server/`.

4.  **UI Integration**:
    *   Added **Video Call Button** to `ChatScreen` and `BuyerChatScreen`.
    *   Added **Incoming Call Modal** to `_layout.tsx` (Global Listener).
    *   Registered `video-call-screen` in the navigation stack.

## 🚀 Final Steps (You Must Do These)

### 1. Run Database Schema
I cannot execute SQL directly on your remote database.
1.  Open **Supabase Dashboard** -> **SQL Editor**.
2.  Open the file `supabase/video-calls-schema.sql` in your project (or copy its content).
3.  **Run** the SQL to create the `calls` table and policies.

### 2. Start the Token Server
Open a new terminal:
```bash
npm run token-server:start
```

### 3. Rebuild the App (Crucial!)
Since we added native code (`react-native-agora`), **Expo Go will NOT work**. You must rebuild a Development Client:

**For Android:**
```bash
npx expo run:android
```

**For iOS:**
```bash
npx expo run:ios
```

### 4. GitHub
I cannot push to GitHub directly. Please commit and push the changes manually:
```bash
git add .
git commit -m "feat: implement agora video calls"
git push
```

## 📱 Testing
1.  Start the app on two devices/simulators.
2.  Login as **Farmer** on one and **Buyer** on the other.
3.  Go to **Messages** -> Open a chat.
4.  Tap the **Video Icon** in the header.
5.  The other device should receive an **Incoming Call Modal**.
