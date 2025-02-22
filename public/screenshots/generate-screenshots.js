import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const screenshotSizes = [
  { width: 1280, height: 800, name: 'desktop' },
  { width: 390, height: 844, name: 'mobile' },
];

async function generateScreenshots() {
  try {
    const baseImage = sharp(join(__dirname, '..', 'icons', 'icon-base.svg'))
      .resize(512, 512)
      .extend({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        background: { r: 59, g: 130, b: 246, alpha: 1 }, // #3B82F6
      });

    for (const size of screenshotSizes) {
      await baseImage
        .resize(size.width, size.height, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .toFile(join(__dirname, `${size.name}.png`));
      console.log(`✓ Gerado ${size.name}.png (${size.width}x${size.height})`);
    }

    console.log('\nTodas as screenshots foram geradas com sucesso!');
  } catch (error) {
    console.error('Erro ao gerar screenshots:', error);
  }
}

generateScreenshots();
