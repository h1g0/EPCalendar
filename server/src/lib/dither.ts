import { Jimp } from "jimp";

export async function ditherWithPalette(
    inputPngBuffer: Buffer,
    paletteHexStrArray: string[],
): Promise<Buffer> {

    const palette = paletteHexStrArray.map((hex) => hexToRgb(hex));

    const image = await Jimp.read(inputPngBuffer);
    const { data, width, height } = image.bitmap;

    // Floyd-Steinberg 誤差拡散
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            // 現在ピクセルの元の色(0-255)
            const oldR = data[idx + 0];
            const oldG = data[idx + 1];
            const oldB = data[idx + 2];
            // const oldA = data[idx + 3]; // アルファは今回は無視

            const { r: newR, g: newG, b: newB } = findNearestColor(
                oldR,
                oldG,
                oldB,
                palette
            );

            data[idx + 0] = newR;
            data[idx + 1] = newG;
            data[idx + 2] = newB;

            const errR = oldR - newR;
            const errG = oldG - newG;
            const errB = oldB - newB;

            distributeError(data, x + 1, y, width, height, errR, errG, errB, 7 / 16);
            distributeError(data, x - 1, y + 1, width, height, errR, errG, errB, 3 / 16);
            distributeError(data, x, y + 1, width, height, errR, errG, errB, 5 / 16);
            distributeError(data, x + 1, y + 1, width, height, errR, errG, errB, 1 / 16);
        }
    }

    // 3. 変換後の画像をPNGとしてBuffer出力
    return await image.getBuffer("image/png");
}

/** 
 * エラーを (nx, ny) ピクセルに拡散加算する。範囲外なら何もしない。
 */
function distributeError(
    data: Buffer,
    nx: number,
    ny: number,
    width: number,
    height: number,
    errR: number,
    errG: number,
    errB: number,
    ratio: number
) {
    if (nx < 0 || nx >= width || ny < 0 || ny >= height) return; // 範囲外
    const i = (ny * width + nx) * 4;
    data[i + 0] = clamp(data[i + 0] + errR * ratio);
    data[i + 1] = clamp(data[i + 1] + errG * ratio);
    data[i + 2] = clamp(data[i + 2] + errB * ratio);
    // data[i + 3] = data[i + 3]; // αはそのまま
}

/**
 * [0,255] に収める
 */
function clamp(val: number): number {
    return val < 0 ? 0 : val > 255 ? 255 : val;
}

/**
 * 16進数カラー(#RRGGBB) を {r, g, b} へ変換
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const cleanHex = hex.replace("#", "");
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return { r, g, b };
}

/**
 * パレット内でもっとも近い色(RGB) を返す
 */
function findNearestColor(
    r: number,
    g: number,
    b: number,
    palette: { r: number; g: number; b: number }[]
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
