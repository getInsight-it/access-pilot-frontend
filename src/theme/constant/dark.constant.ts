import { Theme } from "../theme.model.ts";
import { LIGHT_THEME } from "./light.constant.ts";
import { THEME_COLOR_PALETTE } from "./theme-color-palette.constant";

const DARK_VALUE_TRANSFORMS: Record<string, string> = {
  "#ffffff": "#0f172a",
  "#f3f7f8": "#020617",
  "#f3f4f6": "#0b1220",
  "#fcfdfd": "#111827",
  "#f9fafb": "#111827",
  "#f8fafc": "#1e293b",
  "#f1f5f9": "#1e293b",
  "#eff6ff": "#1e293b",
  "#ecf2fd": "#1e293b",
  "#e5e7eb": "#334155",
  "#e3e8ef": "#334155",
  "#e2e8f0": "#334155",
  "#dbe4ef": "#334155",
  "#dbeafe": "#1e3a8a",
  "#d1d5db": "#475569",
  "#9ca3af": "#64748b",
  "#94A3B8": "#64748b",
  "#94a3b8": "#64748b",
  "#6c727f": "#94a3b8",
  "#6b7280": "#94a3b8",
  "#677389": "#94a3b8",
  "#64748b": "#94a3b8",
  "#4b5563": "#94a3b8",
  "#334155": "#cbd5e1",
  "#1f2937": "#e2e8f0",
  "#111827": "#f8fafc",
  "#0f172a": "#f8fafc",
  "rgba(17, 24, 39, 0.04)": "rgba(148, 163, 184, 0.16)",
  "rgba(17, 24, 39, 0.12)": "rgba(2, 6, 23, 0.65)",
  "rgba(15, 23, 42, 0.14)": "rgba(2, 6, 23, 0.65)",
  "rgba(15, 23, 42, 0.18)": "rgba(2, 6, 23, 0.55)",
  "rgba(255, 255, 255, 0.35)": "rgba(255, 255, 255, 0.1)",
  "rgba(60, 131, 246, 0.05)": "rgba(60, 131, 246, 0.16)",
};

const TOKEN_PATTERN = new RegExp(
  Object.keys(DARK_VALUE_TRANSFORMS)
    .sort((left, right) => right.length - left.length)
    .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|"),
  "g",
);

const mapLightValueToDark = (value: string): string => {
  return value.replace(TOKEN_PATTERN, (token) => DARK_VALUE_TRANSFORMS[token] ?? token);
};

const mapAttributesToDark = (attributes: Theme["attributes"]): Theme["attributes"] => {
  const entries = Object.entries(attributes).map(([key, value]) => {
    if (typeof value !== "string") {
      return [key, value];
    }

    return [key, mapLightValueToDark(value)];
  });

  return Object.fromEntries(entries) as Theme["attributes"];
};

const DARK_ATTRIBUTE_OVERRIDES: Theme["attributes"] = {
  "background": "#0f172a",
  "content-background-color": "#020617",
  "border-color": "#334155",
  "default-text-color": "#e2e8f0",
  "inverse-default-text-color": "#ffffff",
  "title-color": "#f8fafc",
  "description-color": "#94a3b8",
  "meta-label-color": "#64748b",
  "meta-value-color": "#cbd5e1",
  "table-header-filter-background-color": "#111827",
  "table-header-background-color": "#1e293b",
  "table-header-text-color": "#94a3b8",
  "table-border-color": "#334155",
  "table-wide-action-cell-width": "220px",
  "input-border-color": "#475569",
  "input-placeholder-color": "#94a3b8",
  "textarea-placeholder-color": "#94a3b8",
  "dropdown-background-color": "#111827",
  "dropdown-item-hover-background-color": "rgba(148, 163, 184, 0.16)",
  "dropdown-shadow": "0 14px 30px rgba(2, 6, 23, 0.65)",
  "toggle-track-background-color-inactive": "#334155",
  "toggle-thumb-background-color-inactive": "#e2e8f0",
  "toggle-thumb-border-color-inactive": "#64748b",
  "option-select-item-background-color": "#111827",
  "request-access-step-panel-surface-color": "#111827",
  "request-access-system-step-card-background-inactive": "#111827",
  "request-access-system-step-card-background-active": "rgba(60, 131, 246, 0.2)",
  "request-access-justification-dropzone-background": "#111827",
  "request-access-justification-file-item-background": "rgba(30, 58, 138, 0.35)",
  "request-detail-file-row-background-color": "#111827",
  "request-status-tone-neutral-text-color": "#94a3b8",
  "request-status-tone-neutral-surface-color": "rgba(148, 163, 184, 0.18)",
  "request-status-tone-neutral-solid-color": "#64748b",
  "request-status-tone-primary-text-color": "#93c5fd",
  "request-status-tone-primary-surface-color": "rgba(59, 130, 246, 0.2)",
  "request-status-tone-primary-solid-color": "#60a5fa",
  "request-status-tone-success-text-color": "#6ee7b7",
  "request-status-tone-success-surface-color": "rgba(16, 185, 129, 0.2)",
  "request-status-tone-success-solid-color": "#34d399",
  "request-status-tone-danger-text-color": "#fda4af",
  "request-status-tone-danger-surface-color": "rgba(244, 63, 94, 0.2)",
  "request-status-tone-danger-solid-color": "#fb7185",
  "request-status-tone-warning-text-color": "#fcd34d",
  "request-status-tone-warning-surface-color": "rgba(245, 158, 11, 0.22)",
  "request-status-tone-warning-solid-color": "#f59e0b",
  "request-status-tone-violet-text-color": "#c4b5fd",
  "request-status-tone-violet-surface-color": "rgba(139, 92, 246, 0.2)",
  "request-status-tone-violet-solid-color": "#a78bfa",
  "system-detail-attachment-icon-background-color": "rgba(30, 58, 138, 0.3)",
  "system-form-header-background-color": "#111827",
  "attachment-configuration-surface-background-color": "#111827",
  "attachment-configuration-optional-badge-background-color": "#1e293b",
  "attachment-configuration-optional-badge-text-color": "#cbd5e1",
  "attachment-configuration-extension-badge-background-color": "#1e293b",
  "attachment-configuration-extension-badge-text-color": "#94a3b8",
  "dialog-overlay-background-color": "rgba(2, 6, 23, 0.76)",
  "dialog-close-hover-background-color": "#1e293b",
  "dialog-surface-background-color": "#111827",
  "dialog-surface-title-color": "#f8fafc",
  "dialog-surface-description-color": "#94a3b8",
  "login-visual-background-color": "#111827",
  "login-visual-border": "1px solid #334155",
  "header-control-background-color": "#111827",
  "header-control-hover-background-color": "#1e293b",
  "header-control-icon-color": "#cbd5e1",
  "header-user-name-color": "#f8fafc",
  "header-user-email-color": "#94a3b8",
  "header-user-chevron-color": "#94a3b8",
  "sidebar-background-color": "#0b1220",
  "sidebar-item-color": "#94a3b8",
  "sidebar-item-selected-color": "var(--color-primary-500)",
  "sidebar-item-accent-color": "var(--color-primary-500)",
  "sidebar-item-hover-color": "#1e293b",
  "sidebar-tooltip-background-color": "#0f172a",
  "sidebar-tooltip-text-color": "#f8fafc",
  "role-hierarchy-flow-node-surface-color": "#ffffff",
  "role-hierarchy-flow-node-text-color": "#111827",
  "step-loader-card-background-color": "#111827",
  "highlight-loader-track-background-color": "#1e293b",
  "highlight-loader-track-glow": "inset 0 0 0 1px rgba(255, 255, 255, 0.1)",
  "highlight-loader-logo-drop-shadow": "0 1px 4px rgba(2, 6, 23, 0.7)",
};

export const DARK_THEME: Theme = {
  ...LIGHT_THEME,
  primary: THEME_COLOR_PALETTE.primary,
  "theme-type": "dark",
  "attributes": {
    ...mapAttributesToDark(LIGHT_THEME.attributes),
    ...DARK_ATTRIBUTE_OVERRIDES,
  },
};
