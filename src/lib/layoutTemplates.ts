import type { BrandProfile, CreativeLayout } from "./types";

let idCounter = 0;
const genId = () => `layout_${++idCounter}`;

export function generateBaseOfferLayout(brand: BrandProfile): CreativeLayout {
  return {
    id: genId(),
    name: "Square Offer",
    width: 1080,
    height: 1080,
    background: {
      type: "gradient",
      gradient: {
        from: brand.primaryColor,
        to: brand.secondaryColor,
        direction: "vertical",
      },
    },
    elements: [
      {
        id: "logo",
        type: "logo",
        rect: { x: 0.06, y: 0.05, w: 0.18, h: 0.12 },
        imageUrl: brand.logoUrl,
      },
      {
        id: "product",
        type: "product",
        rect: { x: 0.55, y: 0.25, w: 0.35, h: 0.45 },
        imageUrl: brand.productUrl,
      },
      {
        id: "headline",
        type: "headline",
        rect: { x: 0.06, y: 0.28, w: 0.45, h: 0.2 },
        text: "FLAT 30% OFF",
        fontSize: 40,
        fontWeight: "bold",
        align: "left",
        color: "#ffffff",
      },
      {
        id: "subheadline",
        type: "subheadline",
        rect: { x: 0.06, y: 0.5, w: 0.45, h: 0.15 },
        text: brand.tagline || "Limited time festive sale",
        fontSize: 22,
        align: "left",
        color: "#f9fafb",
      },
      {
        id: "cta",
        type: "cta",
        rect: { x: 0.06, y: 0.7, w: 0.25, h: 0.1 },
        text: "Shop Now",
        fontSize: 22,
        align: "center",
        color: "#111827",
      },
    ],
  };
}
