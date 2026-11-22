import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Shaan Shoukath — Backend Engineer & Solution Architect, Kochi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const avatar = await readFile(join(process.cwd(), "public/shaan-avatar.jpg"));
  const src = `data:image/jpeg;base64,${avatar.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#050505",
          color: "#e8e8e8",
          padding: 72,
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -120,
            width: 620,
            height: 620,
            borderRadius: 620,
            background: "radial-gradient(circle, rgba(220,38,38,0.35), rgba(5,5,5,0) 70%)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, color: "#b4b4b4" }}>
            <div style={{ width: 14, height: 14, borderRadius: 14, background: "#e11d2a" }} />
            shaans.works
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 132, fontWeight: 800, letterSpacing: -6, lineHeight: 0.9 }}>SHAAN</div>
            <div style={{ fontSize: 132, fontWeight: 800, letterSpacing: -6, lineHeight: 0.9, color: "#e11d2a" }}>
              SHOUKATH
            </div>
            <div style={{ fontSize: 34, marginTop: 30, color: "#e8e8e8", maxWidth: 700 }}>
              Backend Engineer at Lascade · Solution Architect at LNO Technologies
            </div>
            <div style={{ fontSize: 26, marginTop: 14, color: "#8c8c8c" }}>
              Kochi, Kerala · Maker Faire Kochi core organizer
            </div>
          </div>
        </div>
        <img
          src={src}
          width={300}
          height={300}
          alt=""
          style={{ borderRadius: 300, border: "6px solid #e11d2a", alignSelf: "center", objectFit: "cover" }}
        />
      </div>
    ),
    size
  );
}
