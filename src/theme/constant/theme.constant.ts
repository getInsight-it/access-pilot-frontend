import { Theme } from "../theme.model.ts";
import { LIGHT_THEME } from "./light.constant.ts";
import { DARK_THEME } from "./dark.constant.ts";
import { GOV_THEME } from "./gov.constant.ts";

export const BUILT_IN_THEMES: Record<string, Theme> = {
  light: LIGHT_THEME,
  dark: DARK_THEME,
  gov: GOV_THEME,
  govbr: GOV_THEME,
}
