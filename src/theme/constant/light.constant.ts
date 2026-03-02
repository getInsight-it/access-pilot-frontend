import { THEME_COLOR_PALETTE } from "./theme-color-palette.constant";
import { Theme } from "../theme.model.ts";

export const LIGHT_THEME: Theme = {
  primary: THEME_COLOR_PALETTE.primary,
  "theme-type": "light",
  "attributes": {
    "font-family": "'Inter', sans-serif",
    "background": THEME_COLOR_PALETTE.neutral['950']!,
    "border-color": THEME_COLOR_PALETTE.neutral['700']!,
  }
} as const;
