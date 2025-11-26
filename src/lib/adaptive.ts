import type { CreativeLayout } from "./types";

let idCounter = 100;
const genId = () => `layout_${++idCounter}`;

export function adaptToStory(base: CreativeLayout): CreativeLayout {
  const story: CreativeLayout = {
    ...base,
    id: genId(),
    name: "Story",
    width: 1080,
    height: 1920,
    elements: base.elements.map((el) => {
      const r = { ...el.rect };

      if (el.type === "logo") {
        r.x = 0.35;
        r.y = 0.04;
        r.w = 0.3;
        r.h = 0.1;
      } else if (el.type === "headline") {
        r.x = 0.1;
        r.y = 0.18;
        r.w = 0.8;
        r.h = 0.14;
      } else if (el.type === "subheadline") {
        r.x = 0.1;
        r.y = 0.34;
        r.w = 0.8;
        r.h = 0.12;
      } else if (el.type === "product") {
        r.x = 0.15;
        r.y = 0.48;
        r.w = 0.7;
        r.h = 0.35;
      } else if (el.type === "cta") {
        r.x = 0.3;
        r.y = 0.85;
        r.w = 0.4;
        r.h = 0.08;
      }

      return { ...el, rect: r };
    }),
  };

  return story;
}

export function adaptToLandscape(base: CreativeLayout): CreativeLayout {
  const landscape: CreativeLayout = {
    ...base,
    id: genId(),
    name: "Landscape",
    width: 1200,
    height: 628,
    elements: base.elements.map((el) => {
      const r = { ...el.rect };

      if (el.type === "logo") {
        r.x = 0.05;
        r.y = 0.05;
        r.w = 0.15;
        r.h = 0.12;
      } else if (el.type === "headline") {
        r.x = 0.25;
        r.y = 0.15;
        r.w = 0.5;
        r.h = 0.2;
      } else if (el.type === "subheadline") {
        r.x = 0.25;
        r.y = 0.36;
        r.w = 0.5;
        r.h = 0.15;
      } else if (el.type === "product") {
        r.x = 0.7;
        r.y = 0.2;
        r.w = 0.25;
        r.h = 0.5;
      } else if (el.type === "cta") {
        r.x = 0.25;
        r.y = 0.6;
        r.w = 0.25;
        r.h = 0.12;
      }

      return { ...el, rect: r };
    }),
  };

  return landscape;
}
