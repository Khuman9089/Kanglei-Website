// scripts/generate-playstore-icons.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generateIcons() {
  const svgPath = path.resolve(__dirname, '../public/suryasiddha/icons/icon.svg');
  const targetDir = path.resolve(__dirname, '../public/suryasiddha/icons');

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const svgBuffer = fs.readFileSync(svgPath);

  const sizes = [
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
    { name: 'icon-maskable.png', size: 512 },
    { name: 'icon-96.png', size: 96 },
    { name: 'icon-48.png', size: 48 },
  ];

  for (const { name, size } of sizes) {
    const outPath = path.join(targetDir, name);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outPath);
    console.log(`Generated: ${name} (${size}x${size})`);
  }

  console.log('All Play Store icons successfully generated!');
}

generateIcons().catch(console.error);
