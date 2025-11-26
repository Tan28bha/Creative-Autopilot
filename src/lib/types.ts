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

export type CreativeElement = {
  id: string;
  type: CreativeElementType;
  rect: Rect;
  text?: string;
  fontSize?: number;
  fontWeight?: "regular" | "bold";
  align?: "left" | "center" | "right";
  imageUrl?: string;
  color?: string;
};

export type CreativeLayout = {
  id: string;
  name: string;
  width: number;
  height: number;
  background: {
    type: "solid" | "gradient";
    color?: string;
    gradient?: {
      from: string;
      to: string;
      direction: "vertical" | "horizontal";
    };
  };
  elements: CreativeElement[];
};

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
