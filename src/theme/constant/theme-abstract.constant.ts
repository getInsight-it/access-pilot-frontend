import { ThemeCustomAttributes } from "../theme.model.ts";
import { THEME_COLOR_PALETTE } from "./theme-color-palette.constant.ts";

export const THEME_BASE_CUSTOM_PROPERTIES: ThemeCustomAttributes = {
  'success': THEME_COLOR_PALETTE.success['500'],
  'success-foreground': THEME_COLOR_PALETTE.gray['50'],
  'warning': THEME_COLOR_PALETTE.warning['500'],
  'warning-foreground': THEME_COLOR_PALETTE.gray['950'],
  'info': THEME_COLOR_PALETTE.info['500'],
  'info-foreground': THEME_COLOR_PALETTE.gray['50'],
}
