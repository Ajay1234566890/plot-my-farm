# 🔧 Localhost Troubleshooting Guide

## Current Status

I've killed all previous terminals and processes. Here's what to do:

---

## ✅ STEP-BY-STEP FIX

### **Step 1: Open PowerShell as Administrator**

1. Press `Windows + X`
2. Click "Windows PowerShell (Admin)" or "Terminal (Admin)"
3. Navigate to project:
   ```powershell
   cd "c:\Users\nagen\New folder\plot-my-farm"
   ```

---

### **Step 2: Kill All Node Processes**

```powershell
taskkill /F /IM node.exe
taskkill /F /IM qemu-system-x86_64.exe
taskkill /F /IM emulator.exe
```

---

### **Step 3: Clear All Caches**

```powershell
# Clear npm cache
npm cache clean --force

# Clear Expo cache
npx expo start --clear

# Then press Ctrl+C to stop
```

---

### **Step 4: Start Web Server (Choose ONE method)**

#### **Method A: Using Vite (Recommended)**

```powershell
npx vite --host --port 3000
```

Then open browser to: **http://localhost:3000**

---

#### **Method B: Using Expo**

```powershell
npx expo start --web
```

Then open browser to: **http://localhost:8081**

---

#### **Method C: Using npm script**

```powershell
npm run web
```

Then open browser to: **http://localhost:8081**

---

## 🔍 CHECK FOR ERRORS

### **If you see errors, check:**

1. **Port already in use:**
   ```powershell
   netstat -ano | findstr :3000
   netstat -ano | findstr :8081
   ```
   
   If ports are busy, kill the process:
   ```powershell
   taskkill /F /PID <PID_NUMBER>
   ```

2. **Module not found errors:**
   ```powershell
   npm install
   ```

3. **Permission errors:**
   - Run PowerShell as Administrator
   - Or use:
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   ```

---

## 🌐 WHAT YOU SHOULD SEE

### **In Terminal:**
```
VITE v5.4.10  ready in 1234 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
  ➜  press h + enter to show help
```

### **In Browser:**
- Loading spinner
- Then Plot My Farm splash screen
- Then onboarding screens

---

## ❌ COMMON ERRORS & FIXES

### **Error: "Cannot find module"**

**Fix:**
```powershell
npm install
```

---

### **Error: "Port 3000 is already in use"**

**Fix:**
```powershell
# Find what's using the port
netstat -ano | findstr :3000

# Kill it (replace PID with actual number)
taskkill /F /PID <PID>

# Or use a different port
npx vite --port 3001
```

---

### **Error: "EACCES: permission denied"**

**Fix:**
- Run PowerShell as Administrator
- Or change folder permissions

---

### **Error: Blank white screen in browser**

**Fix:**
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Try hard refresh: `Ctrl + Shift + R`

---

### **Error: "Module not found: expo-router"**

**Fix:**
```powershell
npm install expo-router@latest
```

---

## 🚀 QUICK TEST

Run this simple test to see if Vite works:

```powershell
# Kill everything
taskkill /F /IM node.exe

# Wait 2 seconds
Start-Sleep -Seconds 2

# Start Vite
npx vite --host --port 3000
```

**Expected output:**
```
VITE v5.4.10  ready in XXX ms
➜  Local:   http://localhost:3000/
```

If you see this, **IT'S WORKING!** Open http://localhost:3000

---

## 📊 DIAGNOSTIC COMMANDS

### **Check if server is running:**
```powershell
Test-NetConnection -ComputerName localhost -Port 3000
```

### **Check Node processes:**
```powershell
Get-Process | Where-Object {$_.ProcessName -like "*node*"}
```

### **Check what's on port 3000:**
```powershell
netstat -ano | findstr :3000
```

---

## 🔄 COMPLETE RESET

If nothing works, do a complete reset:

```powershell
# 1. Kill all processes
taskkill /F /IM node.exe

# 2. Delete node_modules and caches
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .expo
Remove-Item -Recurse -Force dist

# 3. Reinstall
npm install

# 4. Start fresh
npx vite --host --port 3000
```

---

## 📱 ALTERNATIVE: Use Expo Go

If web still doesn't work, you can use Expo Go on your phone:

1. Install "Expo Go" app on your Android/iOS phone
2. Run:
   ```powershell
   npx expo start
   ```
3. Scan the QR code with Expo Go app

---

## 🆘 STILL NOT WORKING?

### **Share this information:**

1. **Error message** (exact text)
2. **Terminal output** (copy/paste)
3. **Browser console errors** (F12 → Console tab)
4. **Node version:**
   ```powershell
   node --version
   ```
5. **npm version:**
   ```powershell
   npm --version
   ```

---

## ✅ VERIFICATION CHECKLIST

Before asking for help, verify:

- [ ] Node.js is installed (`node --version`)
- [ ] npm is installed (`npm --version`)
- [ ] node_modules exists
- [ ] No other process using port 3000/8081
- [ ] PowerShell is running as Administrator
- [ ] Firewall allows Node.js
- [ ] Antivirus not blocking Node.js

---

## 🎯 RECOMMENDED APPROACH

**For best results, use this exact sequence:**

```powershell
# 1. Navigate to project
cd "c:\Users\nagen\New folder\plot-my-farm"

# 2. Kill everything
taskkill /F /IM node.exe 2>$null

# 3. Wait
Start-Sleep -Seconds 3

# 4. Start Vite
npx vite --host --port 3000
```

**Then open:** http://localhost:3000

---

**Status:** Ready for troubleshooting!


