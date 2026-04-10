import { DefaultThemeColorPalette, GovbrThemeColorPalette } from "../theme.model.ts";

export const THEME_COLOR_PALETTE: DefaultThemeColorPalette = {
  primary: {
    '25':  'oklch(98.8% 0.013 260)',
    '50':  'oklch(97.8% 0.013 260)',
    '100': 'oklch(94.3% 0.034 260)',
    '200': 'oklch(89.3% 0.062 260)',
    '300': 'oklch(82% 0.103 260)',
    '400': 'oklch(73.6% 0.15 260)',
    '500': 'oklch(62.3% 0.188 260)',
    '600': 'oklch(58.9% 0.175 260)',
    '700': 'oklch(54.1% 0.158 260)',
    '800': 'oklch(47.9% 0.139 260)',
    '900': 'oklch(36.3% 0.102 260)',
    '950': 'oklch(30.8% 0.081 260)',
  },
};

export const GOV_COLOR_PALETTE: GovbrThemeColorPalette = {
  primary: {
    '50': '#EDF5FF',
    '100': '#D4E5FF',
    '200': '#ADCDFF',
    '300': '#81AEFC',
    '400': '#5992ED',
    '500': "#2670E8",
    '600': "#155BCB",
    '700': "#1351B4",
    '800': "#0C326F",
    '900': "#071D41",
  },
} as const;
