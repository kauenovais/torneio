const fs = require('fs');
const sharp = require('sharp');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Lê o arquivo SVG base
const svgBuffer = fs.readFileSync('icon-base.svg');

// Gera os ícones em diferentes tamanhos
async function generateIcons() {
  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .toFile(`icon-${size}x${size}.png`);
    console.log(`Generated icon-${size}x${size}.png`);
  }

  // Gera o apple-touch-icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .toFile('../apple-touch-icon.png');
  console.log('Generated apple-touch-icon.png');
}

generateIcons().catch(console.error);
