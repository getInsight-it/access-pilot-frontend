export const BUILT_IN_SPHERES = ["FEDERAL", "ESTADUAL", "MUNICIPAL"] as const;

export const LEVEL_PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  LARGE_PAGE_SIZE: 100,
  MAX_PAGE_SIZE: 1000,
  PARENT_ITEMS_PAGE_SIZE: 30,
  SUB_ITEMS_PAGE_SIZE: 25,
} as const;

/**
 * API key mask for display purposes
 */
export const API_KEY_MASK = "••••••••••••••••";

/**
 * Level type display names
 */
export const LEVEL_TYPE_DISPLAY_NAMES = {
  BUSINESS: "Negocial",
  EXTERNAL: "Externa",
  BUILT_IN: "Interna",
} as const;

