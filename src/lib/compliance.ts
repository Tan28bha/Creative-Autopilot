// src/lib/compliance.ts

import type { CreativeLayout, CreativeElement } from "./types";

export type ComplianceResult = {
  safeMarginsOk: boolean;
  logoSizeOk: boolean;
  textDensityOk: boolean;
  textCoverage: number;
};

/**
 * Helper: get element rect using new schema
 */
function getRect(el: CreativeElement) {
  return {
    x: el.x ?? 0,
    y: el.y ?? 0,
    width: el.width ?? 100,
    height: el.height ?? 50,
  };
}

/**
 * Run compliance checks
 */
export function runCompliance(layout: CreativeLayout): ComplianceResult {
  const SAFE_MARGIN = 40;

  // --- Safe Margin Check ---
  const safeMarginsOk = layout.elements.every((el) => {
    const r = getRect(el);
    return (
      r.x >= SAFE_MARGIN &&
      r.y >= SAFE_MARGIN &&
      r.x + r.width <= layout.width - SAFE_MARGIN &&
      r.y + r.height <= layout.height - SAFE_MARGIN
    );
  });

  // --- Logo Minimum Size ---
  const logo = layout.elements.find((e) => e.type === "logo");
  const logoSizeOk = logo ? (logo.width ?? 0) >= 80 : true;

  // --- Text Coverage (<= 35%) ---
  const totalArea = layout.width * layout.height;

  const textArea = layout.elements
    .filter((e) => ["text", "offer", "cta"].includes(e.type))
    .reduce((sum, e) => {
      const r = getRect(e);
      return sum + r.width * r.height;
    }, 0);

  const textCoverage = textArea / totalArea;
  const textDensityOk = textCoverage <= 0.35;

  return {
    safeMarginsOk,
    logoSizeOk,
    textDensityOk,
    textCoverage,
  };
}

/**
 * Auto-fix layout violations
 */
export function autoFixLayout(layout: CreativeLayout): CreativeLayout {
  const SAFE_MARGIN = 40;

  const fixedElements = layout.elements.map((el) => {
    const r = getRect(el);

    // Ensure safe margins
    let x = Math.max(SAFE_MARGIN, r.x);
    let y = Math.max(SAFE_MARGIN, r.y);

    if (x + r.width > layout.width - SAFE_MARGIN)
      x = layout.width - SAFE_MARGIN - r.width;

    if (y + r.height > layout.height - SAFE_MARGIN)
      y = layout.height - SAFE_MARGIN - r.height;

    // Fix logo size
    let width = r.width;
    let height = r.height;

    if (el.type === "logo" && width < 80) {
      width = 100;
      height = 100;
    }

    return {
      ...el,
      x,
      y,
      width,
      height,
    };
  });

  return {
    ...layout,
    elements: fixedElements,
  };
}
