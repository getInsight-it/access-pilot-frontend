import { THEME_COLOR_PALETTE } from "./theme-color-palette.constant";
import { Theme } from "../theme.model.ts";

export const DARK_THEME: Theme = {
  primary: THEME_COLOR_PALETTE.primary,
  "theme-type": "dark",
  "attributes": {
    // general
    "font-family": "'Inter', sans-serif",
    "background": "#ffffff",
    "content-background-color": "#f3f4f6",
    "border-color": "#e3e8ef",
    // dashboard-layout
    "size-layout-header": "64px",
    "size-layout-sidebar": "304px",
    "size-layout-sidebar-collapsed": "80px",
    "space-layout-sidebar-items": "16px",
    "border-layout-default": "1px solid var(--border-color)",
    "motion-layout-default": "220ms ease",
    // sidebar
    "sidebar-background-color": "#ffffff",
    "sidebar-item-color": "#677389",
    "sidebar-item-selected-color": THEME_COLOR_PALETTE.primary['500']!,
    "sidebar-item-hover-color": "#ecf2fd",
  }
} as const;
