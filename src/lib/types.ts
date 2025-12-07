export type CreativeElementType =
  | "logo"
  | "product"
  | "headline"
  | "subheadline"
  | "cta";

export type Rect = {
  x: number; // 0–1 relative to width
  y: number; // 0–1 relative to height
  w: number; // 0–1 relative
  h: number; // 0–1 relative
};

// src/lib/types.ts

export type BrandProfile = {
  name: string;
  tagline?: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  tone: "modern" | "playful" | "premium" | "minimal";
  logoUrl: string;
  productUrl?: string;
};

export type CreativeElementType =
  | "logo"
  | "product"
  | "image"
  | "text"
  | "offer"
  | "cta";

export type CreativeElement = {
  id: string;
  type: CreativeElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
  imageUrl?: string; // used for logo/product/image
  fontSize?: number;
  color?: string;
};

export type CreativeLayout = {
  id: string;
  name: string;
  width: number;
  height: number;

  backgroundUrl?: string;

  brandPrimary: string;
  brandSecondary: string;

  borderRadius?: number;
  shadow?: number;
  baseFontSize?: number;

  elements: CreativeElement[];
};
