export interface Theme {
  "theme-type": ThemeType,
  "primary": ThemeColorConfiguration,
  "attributes": ThemeAttributes
}

export type ThemeType = 'light' | 'dark' | 'gov';

export interface ThemeColorConfiguration {
  "0"?: string,
  "10"?: string,
  "25"?: string,
  "50"?: string,
  "100"?: string,
  "200"?: string,
  "300"?: string,
  "400"?: string,
  "500"?: string,
  "600"?: string,
  "700"?: string,
  "800"?: string,
  "900"?: string,
  "950"?: string,
}

export interface ThemeAttributes {
  "font-family"?: string,
  "background": string,
  "border-color": string,
}

export interface ThemeColorPalette {
  primary: ThemeColorConfiguration,
  neutral: ThemeColorConfiguration,
  error  : ThemeColorConfiguration,
  warning: ThemeColorConfiguration,
  success: ThemeColorConfiguration,
}

export interface DefaultThemeColorPalette extends ThemeColorPalette { }

export interface GovbrThemeColorPalette extends ThemeColorPalette { }
