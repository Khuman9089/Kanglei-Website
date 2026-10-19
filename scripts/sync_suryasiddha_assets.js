// scripts/sync_suryasiddha_assets.js
// Copies built SuryaSiddha files into android-twa/app/src/main/assets
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'public', 'suryasiddha');
const destDir = path.join(rootDir, 'android-twa', 'app', 'src', 'main', 'assets');

function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((child) => {
      copyRecursiveSync(path.join(src, child), path.join(dest, child));
    });
  } else {
    const parent = path.dirname(dest);
    if (!fs.existsSync(parent)) {
      fs.mkdirSync(parent, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
}

function syncAssets() {
  console.log('🔄 Syncing built SuryaSiddha web assets into Android APK assets directory...');

  if (!fs.existsSync(srcDir)) {
    throw new Error(`Source directory ${srcDir} does not exist! Please run "npm run build" in SuryaSiddha first.`);
  }

  // Clean old assets directory in Android app
  const destAssetsSubdir = path.join(destDir, 'assets');
  if (fs.existsSync(destAssetsSubdir)) {
    fs.rmSync(destAssetsSubdir, { recursive: true, force: true });
  }

  // Copy everything from public/suryasiddha into android-twa/app/src/main/assets
  copyRecursiveSync(srcDir, destDir);

  console.log('✅ SuryaSiddha assets synced successfully to android-twa/app/src/main/assets!');
  const files = fs.readdirSync(destDir);
  console.log(`   Total root asset files: ${files.length}`);
}

syncAssets();
