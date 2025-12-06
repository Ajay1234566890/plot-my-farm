const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '../assets');

function getAllFiles(dirPath, arrayOfFiles) {
    if (!fs.existsSync(dirPath)) return arrayOfFiles || [];
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function (file) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            arrayOfFiles.push(fullPath);
        }
    });
    return arrayOfFiles;
}

function verifyPng(filePath) {
    try {
        const buffer = fs.readFileSync(filePath);
        if (buffer.length < 8) return false;
        // PNG signature: 89 50 4E 47 0D 0A 1A 0A
        return (
            buffer[0] === 0x89 &&
            buffer[1] === 0x50 &&
            buffer[2] === 0x4e &&
            buffer[3] === 0x47
        );
    } catch (e) {
        return false;
    }
}

console.log('🔍 Scanning assets for corruption...');

try {
    const files = getAllFiles(ASSETS_DIR);
    let deletedCount = 0;

    files.forEach(file => {
        if (path.extname(file).toLowerCase() === '.png') {
            if (!verifyPng(file)) {
                console.log(`🗑️ Deleting corrupted PNG: ${file}`);
                try {
                    fs.unlinkSync(file);
                    deletedCount++;
                } catch (err) {
                    console.error(`❌ Failed to delete ${file}:`, err.message);
                }
            }
        }
    });

    if (deletedCount > 0) {
        console.log(`✅ Removed ${deletedCount} corrupted PNG files.`);
    } else {
        console.log('✅ All PNG assets verified.');
    }
} catch (e) {
    console.error('Error scanning assets:', e);
}
