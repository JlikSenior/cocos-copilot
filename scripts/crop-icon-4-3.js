/**
 * Crop store/icon.png to 4:3 aspect ratio (256x192), center crop.
 * Run from extension root: node scripts/crop-icon-4-3.js
 */
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const iconPath = path.join(root, 'store', 'icon.png');
const tmpPath = path.join(root, 'store', 'icon-4-3-tmp.png');
const outPath = iconPath;

const width = 256;
const height = 192; // 4:3

sharp(iconPath)
    .metadata()
    .then((meta) => {
        const w = meta.width || 256;
        const h = meta.height || 256;
        const x = Math.max(0, Math.floor((w - width) / 2));
        const y = Math.max(0, Math.floor((h - height) / 2));
        return sharp(iconPath)
            .extract({ left: x, top: y, width: Math.min(width, w), height: Math.min(height, h) })
            .resize(width, height)
            .png()
            .toFile(tmpPath);
    })
    .then(() => {
        const fs = require('fs');
        fs.renameSync(tmpPath, outPath);
        console.log('Cropped icon to 4:3:', outPath);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
