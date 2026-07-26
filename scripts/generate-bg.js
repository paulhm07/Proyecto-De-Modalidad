// Genera fondos de UI educativos para EducaPlay
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

async function generateBackground(prompt, outputPath, size = '720x1440') {
  console.log(`Generando imagen: ${outputPath}`);
  console.log(`Size: ${size}`);
  console.log(`Prompt: ${prompt.substring(0, 100)}...`);
  
  const zai = await ZAI.create();
  
  const response = await zai.images.generations.create({
    prompt: prompt,
    size: size,
  });
  
  const imageBase64 = response.data[0].base64;
  const buffer = Buffer.from(imageBase64, 'base64');
  
  // Asegurar que el directorio existe
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, buffer);
  console.log(`OK Guardado: ${outputPath} (${(buffer.length / 1024).toFixed(2)} KB)`);
  return outputPath;
}

// Prompt principal - fondo de UI educativo para tercer grado
const mainPrompt = `Vector style educational app background for third-grade kids, clean and flat UI design, soft light blue and white color palette, subtle geometric patterns, grid lines, stylized floating numbers and math symbols, vibrant yet distraction-free, modern mobile game interface, high resolution, 8k`;

// Variantes adicionales para diferentes contextos de la app
const variants = [
  {
    name: 'bg-login',
    prompt: `Vector style educational app login screen background for third-grade kids, clean flat UI, soft light blue and white palette, subtle geometric patterns, floating numbers and letters, modern mobile game interface, minimal, distraction-free, 8k`,
  },
  {
    name: 'bg-dashboard',
    prompt: `Vector style educational dashboard background for kids, flat UI design, soft pastel blue and cream palette, subtle grid lines, floating math symbols and books, clean and vibrant, modern mobile game, 8k`,
  },
  {
    name: 'bg-math',
    prompt: `Vector style math game background for third-grade kids, flat UI design, soft blue and white palette, subtle grid, floating numbers multiplication symbols, clean modern mobile game interface, vibrant, 8k`,
  },
  {
    name: 'bg-language',
    prompt: `Vector style language arts background for third-grade kids, flat UI design, soft teal and white palette, subtle patterns, floating letters and syllables, clean modern mobile game, vibrant, 8k`,
  },
];

async function main() {
  const outDir = path.join(process.cwd(), 'public', 'game-assets', 'ui-backgrounds');
  
  // Generar el fondo principal
  await generateBackground(
    mainPrompt,
    path.join(outDir, 'bg-main.png'),
    '720x1440'
  );
  
  // Generar variantes
  for (const v of variants) {
    await generateBackground(
      v.prompt,
      path.join(outDir, `${v.name}.png`),
      '720x1440'
    );
  }
  
  console.log('\n=== Todos los fondos generados ===');
  console.log(`Carpeta: ${outDir}`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
