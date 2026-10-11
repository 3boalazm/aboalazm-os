/**
 * GAD brand tokens, taken from the brand book itself (colour slide p.22).
 * RED is the brand red — fine as a fill, but only ~2.3:1 on the dark page
 * background, so text accents use RED_TEXT (a lifted tint of the same hue).
 */
export const BLUE = "#005895";
export const RED = "#AB121C";
export const BLUE_LIGHT = "#CCE3F6";
export const RED_TEXT = "#E8858B";
export const DARK = "#0D1B2A";
export const DARKER = "#080E16";

export const SECTIONS = [
  { id: "cover", label: "Cover" },
  { id: "strategy", label: "Strategy" },
  { id: "persona", label: "Persona" },
  { id: "logo", label: "Logo" },
  { id: "color", label: "Color" },
  { id: "typography", label: "Typography" },
  { id: "applications", label: "Applications" },
] as const;

export const PRIMARY_COLORS = [
  { hex: "#005895", name: "Deep Blue", pantone: "Pantone P 107-8 U", role: "Trust & reliability — primary" },
  { hex: "#AB121C", name: "Crimson Red", pantone: "Pantone P 49-16 U", role: "Energy & vitality — accent" },
  { hex: "#CCE3F6", name: "Sky Blue", pantone: "Pantone P 61-2 U", role: "Light variant" },
  { hex: "#CB7A80", name: "Rose", pantone: "Pantone P 112-1 U", role: "Light variant" },
];

export const NEUTRAL_COLORS = [
  { hex: "#000000", name: "Black", pantone: "Pantone Black", role: "Maximum contrast" },
  { hex: "#878787", name: "Dark Grey", pantone: "Cool Grey 8", role: "Secondary text" },
  { hex: "#D0D0D0", name: "Light Grey", pantone: "Cool Grey 3", role: "Borders, dividers" },
  { hex: "#FFFFFF", name: "White", pantone: "Pantone White", role: "Backgrounds, contrast" },
];

// #5F3393 is a violet — the source slide labels it "Muted Red", which is a
// typo in the book, not something to repeat here.
export const INFOGRAPHIC_COLORS = [
  { hex: "#5F3393", name: "Violet", pantone: "2607" },
  { hex: "#09B6B3", name: "Mint Green", pantone: "326" },
  { hex: "#005694", name: "Navy Blue", pantone: "653" },
  { hex: "#00AAAB", name: "Teal Blue", pantone: "P 124-8 U" },
  { hex: "#F37121", name: "Bright Orange", pantone: "P 30-8 U" },
  { hex: "#CCA57A", name: "Soft Brown", pantone: "728" },
];
