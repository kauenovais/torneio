import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const splashSizes = [
  { width: 640, height: 1136 }, // iPhone 5
  { width: 750, height: 1334 }, // iPhone 6/7/8
  { width: 828, height: 1792 }, // iPhone XR
  { width: 1125, height: 2436 }, // iPhone X/XS
  { width: 1242, height: 2688 }, // iPhone XS Max
  { width: 1170, height: 2532 }, // iPhone 12/13
  { width: 1284, height: 2778 }, // iPhone 12/13 Pro Max
  { width: 1620, height: 2160 }, // iPad
  { width: 1668, height: 2224 }, // iPad Pro 10.5"
  { width: 2048, height: 2732 }, // iPad Pro 12.9"
];

async function generateSplashScreens() {
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

    for (const size of splashSizes) {
      await baseImage
        .resize(size.width, size.height, {
          fit: 'contain',
          background: { r: 59, g: 130, b: 246, alpha: 1 },
        })
        .toFile(join(__dirname, `splash-${size.width}x${size.height}.png`));
      console.log(`✓ Gerado splash-${size.width}x${size.height}.png`);
    }

    console.log('\nTodas as splash screens foram geradas com sucesso!');
  } catch (error) {
    console.error('Erro ao gerar splash screens:', error);
  }
}

generateSplashScreens();
