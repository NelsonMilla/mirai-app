import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#141420",
          backgroundImage:
            "radial-gradient(circle at 22% 18%, rgba(255,107,146,0.45), transparent 55%), radial-gradient(circle at 82% 86%, rgba(212,184,255,0.35), transparent 60%), linear-gradient(135deg, #141420 0%, #1C1C2A 100%)",
          borderRadius: 40,
          boxShadow: "inset 0 0 0 2px rgba(255,107,146,0.45)",
        }}
      >
        <svg
          width="132"
          height="132"
          viewBox="0 0 32 32"
          fill="none"
          shapeRendering="crispEdges"
        >
          <defs>
            <linearGradient id="s" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#FFB8CC" />
            </linearGradient>
          </defs>
          <g fill="url(#s)">
            <rect x="9" y="7" width="14" height="2" />
            <rect x="4" y="13" width="24" height="2" />
            <rect x="15" y="5" width="2" height="17" />
            <rect x="13" y="16" width="2" height="2" />
            <rect x="11" y="18" width="2" height="2" />
            <rect x="9" y="20" width="2" height="2" />
            <rect x="7" y="22" width="2" height="2" />
            <rect x="5" y="24" width="2" height="3" />
            <rect x="17" y="16" width="2" height="2" />
            <rect x="19" y="18" width="2" height="2" />
            <rect x="21" y="20" width="2" height="2" />
            <rect x="23" y="22" width="2" height="2" />
            <rect x="25" y="24" width="2" height="3" />
          </g>
        </svg>
      </div>
    ),
    { ...size },
  );
}
