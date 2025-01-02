import { screenPaletteHex } from "@/const/screen";
import { ditherWithPalette } from "@/lib/dither";
import { takeScreenshot } from "@/lib/screenshot";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";
import { Buffer } from "node:buffer";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const dateStr = await searchParams.get("date");
        let date = dayjs();
        if (dateStr && dayjs(dateStr).isValid()) {
            date = dayjs(dateStr);
        }
        const start = await searchParams.get("start") === "sunday"
            ? "sunday"
            : "monday";
        const lang = await searchParams.get("lang") === "ja" ? "ja" : "en";
        const dither = searchParams.get("dither") === "1" ? true : false;

        let screenshotBuffer = await takeScreenshot(date, start, lang);
        if (dither) {
            screenshotBuffer = await ditherWithPalette(
                Buffer.from(screenshotBuffer),
                screenPaletteHex,
            );
        }
        return new NextResponse(screenshotBuffer, {
            status: 200,
            headers: {
                "Content-Type": "image/png",
            },
        });
    } catch (error) {
        console.error("Screenshot error:", error);
        return NextResponse.json({ error: "Failed to generate screenshot" }, {
            status: 500,
        });
    }
}
