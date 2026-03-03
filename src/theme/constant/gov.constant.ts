import { Theme } from "../theme.model";
import { GOV_COLOR_PALETTE } from "./theme-color-palette.constant";

export const GOV_THEME: Theme = {
  primary: GOV_COLOR_PALETTE.primary,
  "theme-type": "gov",
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
    "sidebar-item-selected-color": GOV_COLOR_PALETTE.primary['500']!,
    "sidebar-item-hover-color": "#ecf2fd",
  }
} as const
