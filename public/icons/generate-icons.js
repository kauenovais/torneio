import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputSvg = join(__dirname, 'icon-base.svg');

async function generateIcons() {
  try {
    // Gerar ícones regulares
    for (const size of sizes) {
      await sharp(inputSvg)
        .resize(size, size)
        .png()
        .toFile(join(__dirname, `icon-${size}x${size}.png`));
      console.log(`✓ Gerado icon-${size}x${size}.png`);
    }

    // Gerar ícone maskable
    await sharp(inputSvg)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 59, g: 130, b: 246, alpha: 1 }, // #3B82F6
      })
      .png()
      .toFile(join(__dirname, 'maskable-icon-512x512.png'));
    console.log('✓ Gerado maskable-icon-512x512.png');

    console.log('\nTodos os ícones foram gerados com sucesso!');
  } catch (error) {
    console.error('Erro ao gerar ícones:', error);
  }
}

generateIcons();
