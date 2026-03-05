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
    "default-text-color": "#ffffff",
    "inverse-default-text-color": "#ffffff",
    "default-text-font-weight": "400",
    "default-button-font-size": "14px",

    // layout
    "main-content-default-max-width": "1260px",
    "title-color": "#111827",
    "title-size": "24px",
    "description-color": "#6c727f",
    "description-size": "14px",
    "meta-label-color": "#94A3B8",
    "meta-value-color": "#334155",

    // table
    "table-header-filter-background-color": "#fcfdfd",
    "table-header-filter-min-height": "72px",
    "table-header-background-color": "#f9fafb",
    "table-header-text-color": "#6b7280",
    "table-header-text-size": "12px",
    "table-row-text-size": "14px",
    "table-footer-min-height": "72px",
    "table-border-color": "#e5e7eb",
    "table-icon-cell-width": "56px",

    // pagination
    "pagination-border-color": "var(--table-border-color)",
    "pagination-border": "1px solid var(--pagination-border-color)",
    "pagination-gap": "0px",
    "pagination-control-radius": "6px",
    "pagination-control-min-width": "84px",
    "pagination-control-height": "36px",
    "pagination-control-padding-inline": "14px",
    "pagination-item-min-width": "36px",
    "pagination-item-padding-inline": "10px",
    "pagination-font-size": "14px",
    "pagination-disabled-opacity": "0.6",

    // input
    "input-border-color": "#d1d5db",
    "input-height": "38px",
    "input-radius": "6px",
    "input-placeholder-color": "#6b7280",
    "input-padding-inline": "12px",
    "input-icon-size": "16px",
    "input-icon-left-offset": "12px",
    "input-padding-inline-with-icon": "40px",

    // badge
    "badge-height": "30px",
    "badge-radius": "9999px",
    "badge-font-size": "12px",
    "badge-padding-inline": "10px",
    "badge-icon-size": "10px",
    "badge-icon-gap": "6px",
    "badge-status-published-text-color": "#01bc78",
    "badge-status-published-background-color": "rgba(16, 185, 129, 0.1)",
    "badge-status-published-border-color": "rgba(16, 185, 129, 0.3)",
    "badge-status-unpublished-text-color": "#fcb600",
    "badge-status-unpublished-background-color": "rgba(245, 158, 11, 0.1)",
    "badge-status-unpublished-border-color": "rgba(245, 158, 11, 0.2)",
    "badge-header-text-color": "#1d4ed8",
    "badge-header-background-color": "rgba(59, 130, 246, 0.2)",
    "badge-header-border-color": "rgba(59, 130, 246, 0.4)",

    // dropdown-menu
    "dropdown-background-color": "#ffffff",
    "dropdown-border-color": "var(--table-border-color)",
    "dropdown-radius": "6px",
    "dropdown-shadow": "0 10px 25px rgba(17, 24, 39, 0.12)",
    "dropdown-font-size": "12px",
    "dropdown-item-height": "32px",
    "dropdown-item-gap": "8px",
    "dropdown-item-padding-inline": "10px",
    "dropdown-item-padding-inline-inset": "32px",
    "dropdown-item-hover-background-color": "rgba(17, 24, 39, 0.04)",
    "dropdown-item-indicator-left": "10px",
    "dropdown-content-padding": "6px",
    "dropdown-min-width": "160px",
    "dropdown-icon-size": "14px",
    "dropdown-z-index": "50",
    "dropdown-slide-distance": "4px",
    "dropdown-disabled-opacity": "0.5",
    "dropdown-label-font-weight": "600",
    "dropdown-separator-color": "var(--table-border-color)",
    "dropdown-separator-margin-block": "4px",
    "dropdown-shortcut-opacity": "0.7",

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
