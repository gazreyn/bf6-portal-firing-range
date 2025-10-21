// View-related constants for Weapon Catalog (layout + theme)
// Keep simple numeric and array values to avoid coupling to engine types

export const LAYOUT = {
  Catalog: { width: 1200, height: 600, padding: 16 },
  Sidebar: { width: 250, button: { height: 50, textSize: 24, spacing: 4 } },
  Header: { height: 60, padding: 8, back: { size: 40 }, close: { size: 40 } },
  Grid: {
    item: { width: 250, height: 166, textWidth: 250, imagePaddingX: 16 },
    gap: { x: 16, y: 16 },
    pagePadding: 16,
  },
  Slots: {
    item: { width: 200, height: 50 },
    gap: { x: 16, y: 16 },
  },
  Attachments: {
    item: { width: 200, height: 50 },
    gap: { x: 16, y: 16 },
  },
} as const;

export const THEME = {
  colors: {
    surfaceBg: [0, 0, 0] as number[],
    elementBg: [0.05, 0.05, 0.05] as number[],
    textPrimary: [1, 1, 1] as number[],
    textAccent: [1, 0.98, 0.65] as number[],
  },
  alpha: {
    surface: 0.75,
    sidebar: 0.5,
    solid: 1.0,
  },
} as const;
