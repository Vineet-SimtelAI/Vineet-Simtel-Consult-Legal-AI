const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  console.log('Copying static assets for standalone deployment...');
  
  // Copy .next/static to .next/standalone/.next/static
  const staticSrc = path.join(__dirname, '.next', 'static');
  const staticDest = path.join(__dirname, '.next', 'standalone', '.next', 'static');
  if (fs.existsSync(staticSrc)) {
    copyDir(staticSrc, staticDest);
    console.log('Copied .next/static successfully.');
  }

  // Copy public to .next/standalone/public
  const publicSrc = path.join(__dirname, 'public');
  const publicDest = path.join(__dirname, '.next', 'standalone', 'public');
  if (fs.existsSync(publicSrc)) {
    copyDir(publicSrc, publicDest);
    console.log('Copied public/ successfully.');
  }

  console.log('Standalone asset copying complete.');
} catch (err) {
  console.error('Failed to copy assets:', err.message);
  process.exit(1);
}
