// src/lib/aiBackground.ts

export type BackgroundRequest = {
  primaryColor: string;
  secondaryColor: string;
  tone: "modern" | "playful" | "premium" | "minimal";
  prompt?: string;
};

export type BackgroundResult = {
  css: string; // full background CSS (e.g. linear-gradient(...))
  description: string;
};

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

// small helper to slightly lighten/darken a hex color
function adjustColor(hex: string, amount: number): string {
  if (!hex.startsWith("#")) return hex;
  let c = hex.slice(1);
  if (c.length === 3) {
    c = c.split("").map((ch) => ch + ch).join("");
  }
  const num = parseInt(c, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0xff) + amount;
  let b = (num & 0xff) + amount;
  r = clamp01(r);
  g = clamp01(g);
  b = clamp01(b);
  const toHex = (v: number) => {
    const c = clamp01(v);
    return Math.max(0, Math.min(255, c))
      .toString(16)
      .padStart(2, "0");
  };
  return "#" + toHex(r) + toHex(g) + toHex(b);
}

export function generateBackground({
  primaryColor,
  secondaryColor,
  tone,
  prompt,
}: BackgroundRequest): BackgroundResult {
  const p = (prompt || "").toLowerCase();

  // decide gradient angle based on tone/prompt
  let angle = "135deg";
  if (p.includes("vertical")) angle = "180deg";
  if (p.includes("horizontal")) angle = "90deg";
  if (tone === "minimal") angle = "145deg";

  // compute 3–4 color stops
  const base1 = primaryColor || "#6366f1";
  const base2 = secondaryColor || "#ec4899";
  const mid = adjustColor(primaryColor, 25);
  const dark = adjustColor(primaryColor, -35);

  let stops: string[] = [];

  if (tone === "premium") {
    stops = [
      `${dark} 0%`,
      `${base1} 35%`,
      `${mid} 70%`,
      `${base2} 100%`,
    ];
  } else if (tone === "playful") {
    stops = [
      `${base1} 0%`,
      `${base2} 40%`,
      `${mid} 75%`,
      "#ffffff10 100%",
    ];
  } else if (tone === "minimal") {
    stops = [
      `${adjustColor(primaryColor, 40)} 0%`,
      `${adjustColor(primaryColor, 5)} 55%`,
      `${adjustColor(primaryColor, -15)} 100%`,
    ];
  } else {
    // modern default
    stops = [
      `${base1} 0%`,
      `${mid} 50%`,
      `${base2} 100%`,
    ];
  }

  // modify slightly based on prompt keywords
  if (p.includes("festive") || p.includes("diwali") || p.includes("celebration")) {
    stops.push("#facc1515 100%");
  }
  if (p.includes("sale") || p.includes("offer")) {
    stops[0] = "#ef4444";
  }
  if (p.includes("neon")) {
    stops = [
      "#0f172a",
      "#22c55e",
      "#22d3ee",
      "#a855f7",
    ].map((c, i) => `${c} ${i * 33}%`);
  }

  const css = `linear-gradient(${angle}, ${stops.join(", ")})`;

  const description = `Auto-generated ${tone} background with ${
    p || "brand-driven"
  } styling.`;

  return { css, description };
}
