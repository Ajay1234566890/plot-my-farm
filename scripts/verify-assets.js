const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '../assets');

function getAllFiles(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

function verifyPng(filePath) {
  const buffer = fs.readFileSync(filePath);
  // PNG signature: 89 50 4E 47 0D 0A 1A 0A
  if (buffer.length < 8) return false;
  return (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  );
}

console.log('🔍 Verifying assets in:', ASSETS_DIR);

try {
  const files = getAllFiles(ASSETS_DIR);
  let errorCount = 0;

  files.forEach(file => {
    if (path.extname(file).toLowerCase() === '.png') {
      if (!verifyPng(file)) {
        console.error(`❌ CORRUPTED PNG FOUND: ${file}`);
        // Optional: Delete or rename corrupted file? 
        // For now, just reporting.
        errorCount++;
      }
    }
  });

  if (errorCount > 0) {
    console.error(`\n⚠️ FOUND ${errorCount} CORRUPTED PNG FILES.`);
    console.error('Please fix or remove these files before building.');
    process.exit(1);
  } else {
    console.log('✅ All PNG assets verified successfully.');
  }
} catch (e) {
  console.error('Error scanning assets:', e);
  // Don't fail the build script if this check fails, just warn
}
