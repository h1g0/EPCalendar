import { Jimp } from "jimp";
import { Buffer } from "node:buffer";

export async function ditherWithPalette(
  inputPngBuffer: Buffer,
  paletteHexStrArray: string[],
): Promise<Buffer> {
  const palette = paletteHexStrArray.map((hex) => hexStrToRgb(hex));

  const image = await Jimp.read(inputPngBuffer);
  const { data, width, height } = image.bitmap;

  // Floyd-Steinberg error diffusion
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      const oldR = data[idx + 0];
      const oldG = data[idx + 1];
      const oldB = data[idx + 2];
      // const oldA = data[idx + 3]; // Ignore alpha for now

      const { r: newR, g: newG, b: newB } = findNearestColor(
        oldR,
        oldG,
        oldB,
        palette,
      );

      data[idx + 0] = newR;
      data[idx + 1] = newG;
      data[idx + 2] = newB;

      const errR = oldR - newR;
      const errG = oldG - newG;
      const errB = oldB - newB;

      distributeError(data, x + 1, y, width, height, errR, errG, errB, 7 / 16);
      distributeError(
        data,
        x - 1,
        y + 1,
        width,
        height,
        errR,
        errG,
        errB,
        3 / 16,
      );
      distributeError(data, x, y + 1, width, height, errR, errG, errB, 5 / 16);
      distributeError(
        data,
        x + 1,
        y + 1,
        width,
        height,
        errR,
        errG,
        errB,
        1 / 16,
      );
    }
  }

  return await image.getBuffer("image/png");
}

function distributeError(
  data: Buffer,
  nx: number,
  ny: number,
  width: number,
  height: number,
  errR: number,
  errG: number,
  errB: number,
  ratio: number,
) {
  if (nx < 0 || nx >= width || ny < 0 || ny >= height) return;
  const i = (ny * width + nx) * 4;
  data[i + 0] = clamp(data[i + 0] + errR * ratio);
  data[i + 1] = clamp(data[i + 1] + errG * ratio);
  data[i + 2] = clamp(data[i + 2] + errB * ratio);
}

function clamp(val: number): number {
  return val < 0 ? 0 : val > 255 ? 255 : val;
}

function hexStrToRgb(hex: string): { r: number; g: number; b: number } {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return { r, g, b };
}

function findNearestColor(
  r: number,
  g: number,
  b: number,
  palette: { r: number; g: number; b: number }[],
) {
  let minDist = Number.MAX_VALUE;
  let closest = palette[0];
  for (const c of palette) {
    const dr = r - c.r;
    const dg = g - c.g;
    const db = b - c.b;
    const dist = dr * dr + dg * dg + db * db; // ユークリッド距離^2
    if (dist < minDist) {
      minDist = dist;
      closest = c;
    }
  }
  return closest;
}
