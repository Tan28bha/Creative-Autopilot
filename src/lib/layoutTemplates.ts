import { CreativeLayout, BrandProfile } from "./types";

export function generateBaseOfferLayout(brand: BrandProfile): CreativeLayout {
  return {
    id: crypto.randomUUID(),
    name: "Main Creative",
    width: 800,
    height: 1000,
    brandPrimary: brand.primaryColor,
    brandSecondary: brand.secondaryColor,
    backgroundUrl: undefined,

    elements: [
      {
        id: crypto.randomUUID(),
        type: "logo",
        imageUrl: brand.logoUrl,
        x: 40,
        y: 40,
        width: 140,
        height: 140,
      },

      brand.productUrl
        ? {
            id: crypto.randomUUID(),
            type: "product",
            imageUrl: brand.productUrl,
            x: 260,
            y: 280,
            width: 300,
            height: 300,
          }
        : null,

      {
        id: crypto.randomUUID(),
        type: "text",
        text: brand.name,
        x: 50,
        y: 220,
        width: 600,
        height: 60,
        color: "#ffffff",
        fontSize: 42,
      },

      {
        id: crypto.randomUUID(),
        type: "offer",
        text: "20% OFF",
        x: 50,
        y: 300,
        width: 300,
        height: 50,
        color: "#FFD700",
        fontSize: 48,
      },

      {
        id: crypto.randomUUID(),
        type: "cta",
        text: "Shop Now",
        x: 50,
        y: 370,
        width: 200,
        height: 40,
        color: "#ffffff",
        fontSize: 28,
      },
    ].filter(Boolean) as any,
  };
}
