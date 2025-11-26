import type { CreativeLayout } from "./types";

const SAFE_MARGIN = 0.05;
const MIN_LOGO_WIDTH = 0.12;
const MAX_TEXT_COVERAGE = 0.35;

export type ComplianceResult = {
  safeMarginsOk: boolean;
  logoSizeOk: boolean;
  textDensityOk: boolean;
  textCoverage: number;
};

export function runCompliance(layout: CreativeLayout): ComplianceResult {
  const elements = layout.elements;

  // Safe margins
  const marginViolations = elements.filter((el) => {
    const { x, y, w, h } = el.rect;
    return (
      x < SAFE_MARGIN ||
      y < SAFE_MARGIN ||
      x + w > 1 - SAFE_MARGIN ||
      y + h > 1 - SAFE_MARGIN
    );
  });

  // Logo size
  const logo = elements.find((e) => e.type === "logo");
  const logoSizeOk = logo ? logo.rect.w >= MIN_LOGO_WIDTH : false;

  // Text coverage
  const textElements = elements.filter((e) =>
    ["headline", "subheadline", "cta"].includes(e.type)
  );
  const coverage = textElements.reduce((sum, el) => sum + el.rect.w * el.rect.h, 0);

  return {
    safeMarginsOk: marginViolations.length === 0,
    logoSizeOk,
    textDensityOk: coverage <= MAX_TEXT_COVERAGE,
    textCoverage: coverage,
  };
}

export function autoFixLayout(layout: CreativeLayout): CreativeLayout {
  const next = structuredClone(layout) as CreativeLayout;

  // Fix margins
  next.elements = next.elements.map((el) => {
    const r = { ...el.rect };
    if (r.x < SAFE_MARGIN) r.x = SAFE_MARGIN;
    if (r.y < SAFE_MARGIN) r.y = SAFE_MARGIN;
    if (r.x + r.w > 1 - SAFE_MARGIN) r.x = 1 - SAFE_MARGIN - r.w;
    if (r.y + r.h > 1 - SAFE_MARGIN) r.y = 1 - SAFE_MARGIN - r.h;
    return { ...el, rect: r };
  });

  // Fix logo size
  const logoIndex = next.elements.findIndex((e) => e.type === "logo");
  if (logoIndex !== -1) {
    const logo = next.elements[logoIndex];
    if (logo.rect.w < MIN_LOGO_WIDTH) {
      const factor = MIN_LOGO_WIDTH / logo.rect.w;
      const newW = logo.rect.w * factor;
      const newH = logo.rect.h * factor;
      next.elements[logoIndex] = {
        ...logo,
        rect: {
          ...logo.rect,
          w: newW,
          h: newH,
        },
      };
    }
  }

  // Fix text density (simple: shrink text boxes slightly)
  const result = runCompliance(next);
  if (!result.textDensityOk) {
    next.elements = next.elements.map((el) => {
      if (!["headline", "subheadline", "cta"].includes(el.type)) return el;
      return {
        ...el,
        rect: {
          ...el.rect,
          h: el.rect.h * 0.8,
          w: el.rect.w * 0.9,
        },
        fontSize: (el.fontSize ?? 22) * 0.9,
      };
    });
  }

  return next;
}


