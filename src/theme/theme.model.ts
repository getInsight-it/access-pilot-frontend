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
  "content-background-color": string,
  "border-color": string,
  "size-layout-header": string,
  "size-layout-sidebar": string,
  "size-layout-sidebar-collapsed": string,
  "space-layout-sidebar-items": string,
  "border-layout-default": string,
  "motion-layout-default": string,
  "sidebar-background-color": string,
  "sidebar-item-color": string,
  "sidebar-item-selected-color": string,
  "sidebar-item-hover-color": string,
}

export interface ThemeColorPalette { 
  primary: ThemeColorConfiguration 
}

export interface DefaultThemeColorPalette extends ThemeColorPalette { }

export interface GovbrThemeColorPalette extends ThemeColorPalette { }
