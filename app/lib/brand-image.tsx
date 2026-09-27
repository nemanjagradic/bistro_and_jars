import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

const BACKGROUND = "#0b0a09";

function pngSize(png: Buffer) {
  return {
    width: png.readUInt32BE(16),
    height: png.readUInt32BE(20),
  };
}

function fitInside(
  imageWidth: number,
  imageHeight: number,
  boxWidth: number,
  boxHeight: number,
) {
  const scale = Math.min(boxWidth / imageWidth, boxHeight / imageHeight);
  return {
    width: Math.max(1, Math.floor(imageWidth * scale)),
    height: Math.max(1, Math.floor(imageHeight * scale)),
  };
}

export function brandImage(
  size: { width: number; height: number },
  zoom = 1,
) {
  return readFile(join(process.cwd(), "public/brand/logo.png")).then((logo) => {
    const source = pngSize(logo);
    const fitted = fitInside(
      source.width,
      source.height,
      size.width,
      size.height,
    );
    const width = Math.max(1, Math.round(fitted.width * zoom));
    const height = Math.max(1, Math.round(fitted.height * zoom));
    const src = `data:image/png;base64,${logo.toString("base64")}`;

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            background: BACKGROUND,
          }}
        >
          <img
            src={src}
            width={width}
            height={height}
            style={{ width, height, flexShrink: 0 }}
          />
        </div>
      ),
      size,
    );
  });
}
