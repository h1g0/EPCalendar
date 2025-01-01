import { screenPaletteHex } from "@/const/screen";
import { ditherWithPalette } from "@/lib/dither";
import { takeScreenshot } from "@/lib/screenshot";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const start = await searchParams.get("start") === "sunday" ? "sunday" : "monday";
        const dither = searchParams.get("dither") === "1" ? true : false;

        let screenshotBuffer = await takeScreenshot(start);
        if (dither) {
            screenshotBuffer = await ditherWithPalette(Buffer.from(screenshotBuffer), screenPaletteHex);
        }
        return new NextResponse(screenshotBuffer, {
            status: 200,
            headers: {
                "Content-Type": "image/png",
            },
        });
    } catch (error) {
        console.error("Screenshot error:", error);
        return NextResponse.json({ error: "Failed to generate screenshot" }, { status: 500 });
    }
}
