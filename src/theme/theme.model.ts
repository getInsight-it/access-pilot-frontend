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
  // general
  "font-family"?: string,
  "background": string,
  "content-background-color": string,
  "border-color": string,
  "default-text-color"?: string,
  "inverse-default-text-color"?: string,
  "default-text-font-weight"?: string,
  "default-button-font-size"?: string,

  // layout
  "main-content-default-max-width"?: string,
  "title-color"?: string,
  "title-size"?: string,
  "description-color"?: string,
  "description-size"?: string,

  // table
  "table-header-filter-background-color"?: string,
  "table-header-filter-min-height"?: string,
  "table-header-background-color"?: string,
  "table-header-text-color"?: string,
  "table-header-text-size"?: string,
  "table-row-text-size"?: string,
  "table-footer-min-height"?: string,
  "table-border-color"?: string,
  "table-icon-cell-width"?: string,

  // pagination
  "pagination-border-color"?: string,
  "pagination-border"?: string,
  "pagination-gap"?: string,
  "pagination-control-radius"?: string,
  "pagination-control-min-width"?: string,
  "pagination-control-height"?: string,
  "pagination-control-padding-inline"?: string,
  "pagination-item-min-width"?: string,
  "pagination-item-padding-inline"?: string,
  "pagination-font-size"?: string,
  "pagination-disabled-opacity"?: string,

  // input
  "input-border-color"?: string,
  "input-height"?: string,
  "input-radius"?: string,
  "input-placeholder-color"?: string,
  "input-padding-inline"?: string,
  "input-icon-size"?: string,
  "input-icon-left-offset"?: string,
  "input-padding-inline-with-icon"?: string,

  // badge
  "badge-height"?: string,
  "badge-radius"?: string,
  "badge-font-size"?: string,
  "badge-padding-inline"?: string,
  "badge-icon-size"?: string,
  "badge-icon-gap"?: string,
  "badge-status-published-text-color"?: string,
  "badge-status-published-background-color"?: string,
  "badge-status-published-border-color"?: string,
  "badge-status-unpublished-text-color"?: string,
  "badge-status-unpublished-background-color"?: string,
  "badge-status-unpublished-border-color"?: string,
  "badge-header-text-color"?: string,
  "badge-header-background-color"?: string,
  "badge-header-border-color"?: string,

  // dropdown-menu
  "dropdown-background-color"?: string,
  "dropdown-border-color"?: string,
  "dropdown-radius"?: string,
  "dropdown-shadow"?: string,
  "dropdown-font-size"?: string,
  "dropdown-item-height"?: string,
  "dropdown-item-gap"?: string,
  "dropdown-item-padding-inline"?: string,
  "dropdown-item-padding-inline-inset"?: string,
  "dropdown-item-hover-background-color"?: string,
  "dropdown-item-indicator-left"?: string,
  "dropdown-content-padding"?: string,
  "dropdown-min-width"?: string,
  "dropdown-icon-size"?: string,
  "dropdown-z-index"?: string,
  "dropdown-slide-distance"?: string,
  "dropdown-disabled-opacity"?: string,
  "dropdown-label-font-weight"?: string,
  "dropdown-separator-color"?: string,
  "dropdown-separator-margin-block"?: string,
  "dropdown-shortcut-opacity"?: string,

  // dashboard-layout
  "size-layout-header": string,
  "size-layout-sidebar": string,
  "size-layout-sidebar-collapsed": string,
  "space-layout-sidebar-items": string,
  "border-layout-default": string,
  "motion-layout-default": string,

  // sidebar
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
