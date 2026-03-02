import { Theme } from "../theme.model";
import { GOV_COLOR_PALETTE } from "./theme-color-palette.constant";

export const GOV_THEME: Theme = {
  primary: GOV_COLOR_PALETTE.primary,
  "theme-type": "gov",
  "attributes": {
    "font-family": "'Inter', sans-serif",
    "background": GOV_COLOR_PALETTE.neutral['950']!,
    "border-color": GOV_COLOR_PALETTE.neutral['700']!,
  }
} as const
