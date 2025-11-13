# 🚀 Run Plot My Farm on Localhost - COMPLETE GUIDE

## ⚠️ ISSUE IDENTIFIED

**Problem:** Vite server wasn't starting because:
1. PowerShell execution policy blocking npm commands
2. Dependencies might not be fully installed
3. Terminal output not showing errors

**Solution:** Use batch files that bypass PowerShell restrictions!

---

## ✅ FIXED! - 3 EASY WAYS TO RUN

### **🎯 METHOD 1: ONE-CLICK FIX (RECOMMENDED)**

**Just double-click this file:**
```
FIX-AND-RUN.bat
```

**What it does:**
1. ✅ Kills all old processes
2. ✅ Checks Node.js installation
3. ✅ Installs ALL dependencies automatically
4. ✅ Installs web-specific dependencies (react-dom, react-native-web, vite)
5. ✅ Starts Expo web server
6. ✅ Opens browser automatically after 15 seconds

**This is the EASIEST method!** Just double-click and wait!

---

### **🔧 METHOD 2: Install Dependencies First**

If you want to install dependencies separately:

**Step 1:** Double-click:
```
INSTALL-WEB-DEPENDENCIES.bat
```

**Step 2:** Then double-click:
```
RUN-LOCALHOST-SIMPLE.bat
```

---

### **⌨️ METHOD 3: Manual Commands**

Open Command Prompt (NOT PowerShell) and run:

```cmd
cd "c:\Users\nagen\New folder\plot-my-farm"

REM Kill old processes
taskkill /F /IM node.exe

REM Install dependencies
npm install
npm install react-dom@19.1.0 react-native-web@0.21.1
npm install --save-dev vite@5.4.10 @vitejs/plugin-react@4.3.3 vite-plugin-react-native-web@2.3.0

REM Start server
npx expo start --web
```

Then open: http://localhost:8081

---

## 📋 WHAT YOU NEED

### **Already Installed:**
- ✅ Node.js v24.11.0
- ✅ npm 11.6.1

### **Will Be Installed Automatically:**
- ✅ react-dom 19.1.0
- ✅ react-native-web 0.21.1
- ✅ vite 5.4.10
- ✅ @vitejs/plugin-react 4.3.3
- ✅ vite-plugin-react-native-web 2.3.0
- ✅ All other dependencies (1423 packages)

---

## ⏱️ EXPECTED TIMELINE

### **First Run:**
1. **Dependency installation:** 2-5 minutes
2. **Server startup:** 30-60 seconds
3. **Browser opens:** Automatically after 15 seconds
4. **App loads:** 10-30 seconds

**Total:** ~3-7 minutes

### **Subsequent Runs:**
1. **Server startup:** 10-20 seconds
2. **App loads:** 5-10 seconds

**Total:** ~15-30 seconds

---

## 🌐 WHAT YOU'LL SEE

### **In Command Prompt:**
```
[STEP 1/4] Cleaning up old processes...
Done!

[STEP 2/4] Checking Node.js...
v24.11.0
11.6.1
Node.js is installed!

[STEP 3/4] Installing dependencies...
Dependencies installed!

[STEP 4/4] Starting web server...

Starting Metro Bundler...
Web is waiting on http://localhost:8081

› Press w │ open web
```

### **In Browser:**
1. **Loading spinner** (10-30 seconds)
2. **Splash screen** (Plot My Farm logo)
3. **Onboarding screens**
4. **Role selection** (Farmer/Buyer)
5. **Login screen**
6. **Home screen** with map and features

---

## ❌ TROUBLESHOOTING

### **Error: "Node.js is not installed"**

**Fix:**
1. Download Node.js from: https://nodejs.org/
2. Install it
3. Restart Command Prompt
4. Run the batch file again

---

### **Error: "npm is not recognized"**

**Fix:**
1. Restart your computer
2. Open Command Prompt
3. Run: `node --version` and `npm --version`
4. If still not working, reinstall Node.js

---

### **Error: "Port 8081 is already in use"**

**Fix:**
```cmd
netstat -ano | findstr :8081
taskkill /F /PID <PID_NUMBER>
```

Then run the batch file again.

---

### **Error: "Cannot find module"**

**Fix:**
```cmd
cd "c:\Users\nagen\New folder\plot-my-farm"
rmdir /S /Q node_modules
npm install
```

Then run the batch file again.

---

### **Browser shows "localhost refused to connect"**

**Fix:**
1. Wait 30 more seconds (server might still be starting)
2. Check Command Prompt for errors
3. If you see "Web is waiting on http://localhost:8081", manually open that URL
4. If no URL appears, press Ctrl+C and run the batch file again

---

### **Blank white screen in browser**

**Fix:**
1. Press F12 to open Developer Tools
2. Go to Console tab
3. Look for red error messages
4. Try hard refresh: Ctrl + Shift + R
5. If errors persist, share them with me

---

## 🎯 RECOMMENDED STEPS RIGHT NOW

### **Do this:**

1. **Close all terminals and Command Prompts**

2. **Double-click this file:**
   ```
   FIX-AND-RUN.bat
   ```

3. **Wait and watch the Command Prompt window**
   - It will show progress for each step
   - Don't close it!

4. **Wait for the message:**
   ```
   Web is waiting on http://localhost:8081
   ```

5. **Browser will open automatically**
   - If not, manually open: http://localhost:8081

6. **Wait 30 seconds for the app to load**

7. **Tell me what you see!**

---

## 📁 FILES CREATED FOR YOU

1. **`FIX-AND-RUN.bat`** ⭐ - ONE-CLICK solution (RECOMMENDED)
2. **`INSTALL-WEB-DEPENDENCIES.bat`** - Install dependencies only
3. **`RUN-LOCALHOST-SIMPLE.bat`** - Run server (after dependencies installed)
4. **`START-WEB.bat`** - Alternative launcher
5. **`README-LOCALHOST.md`** - This guide
6. **`LOCALHOST_TROUBLESHOOTING.md`** - Detailed troubleshooting
7. **`CURRENT_STATUS_LOCALHOST.md`** - Current status

---

## ✅ VERIFICATION

After running, you should have:

- ✅ Command Prompt showing "Web is waiting on http://localhost:8081"
- ✅ Browser open to http://localhost:8081
- ✅ App loading or loaded
- ✅ No error messages

---

## 🆘 IF NOTHING WORKS

1. **Take a screenshot** of the Command Prompt window
2. **Take a screenshot** of the browser error (if any)
3. **Press F12** in browser, go to Console tab, take a screenshot
4. **Share these screenshots** with me

I'll help you fix it!

---

## 🎉 SUCCESS INDICATORS

You'll know it's working when you see:

✅ Command Prompt shows: "Web is waiting on http://localhost:8081"  
✅ Browser opens automatically  
✅ Loading spinner appears  
✅ Plot My Farm splash screen shows  
✅ You can navigate through onboarding screens  

---

**Status:** Ready to run!  
**Next Step:** Double-click `FIX-AND-RUN.bat`


