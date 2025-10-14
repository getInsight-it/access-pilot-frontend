import type { Config } from "tailwindcss"

const APP_COLORS = {
  primary: {
    25: 'var(--color-primary-25)',
    50: 'var(--color-primary-50)',
    100: 'var(--color-primary-100)',
    200: 'var(--color-primary-200)',
    300: 'var(--color-primary-300)',
    400: 'var(--color-primary-400)',
    500: 'var(--color-primary-500)',
    600: 'var(--color-primary-600)',
    700: 'var(--color-primary-700)',
    800: 'var(--color-primary-800)',
    900: 'var(--color-primary-900)',
    950: 'var(--color-primary-950)',
  },
  blue: {
    25: 'var(--color-blue-25)',
    50: 'var(--color-blue-50)',
    100: 'var(--color-blue-100)',
    200: 'var(--color-blue-200)',
    300: 'var(--color-blue-300)',
    400: 'var(--color-blue-400)',
    500: 'var(--color-blue-500)',
    600: 'var(--color-blue-600)',
    700: 'var(--color-blue-700)',
    800: 'var(--color-blue-800)',
    900: 'var(--color-blue-900)',
    950: 'var(--color-blue-950)'
  },
  purple: {
    25: 'var(--color-purple-25)',
    50: 'var(--color-purple-50)',
    100: 'var(--color-purple-100)',
    200: 'var(--color-purple-200)',
    300: 'var(--color-purple-300)',
    400: 'var(--color-purple-400)',
    500: 'var(--color-purple-500)',
    600: 'var(--color-purple-600)',
    700: 'var(--color-purple-700)',
    800: 'var(--color-purple-800)',
    900: 'var(--color-purple-900)',
    950: 'var(--color-purple-950)'
  },
  pink: {
    25: 'var(--color-pink-25)',
    50: 'var(--color-pink-50)',
    100: 'var(--color-pink-100)',
    200: 'var(--color-pink-200)',
    300: 'var(--color-pink-300)',
    400: 'var(--color-pink-400)',
    500: 'var(--color-pink-500)',
    600: 'var(--color-pink-600)',
    700: 'var(--color-pink-700)',
    800: 'var(--color-pink-800)',
    900: 'var(--color-pink-900)',
    950: 'var(--color-pink-950)'
  },
  indigo: {
    25: 'var(--color-indigo-25)',
    50: 'var(--color-indigo-50)',
    100: 'var(--color-indigo-100)',
    200: 'var(--color-indigo-200)',
    300: 'var(--color-indigo-300)',
    400: 'var(--color-indigo-400)',
    500: 'var(--color-indigo-500)',
    600: 'var(--color-indigo-600)',
    700: 'var(--color-indigo-700)',
    800: 'var(--color-indigo-800)',
    900: 'var(--color-indigo-900)',
    950: 'var(--color-indigo-950)'
  },
  gray: {
    25: 'var(--color-gray-25)',
    50: 'var(--color-gray-50)',
    100: 'var(--color-gray-100)',
    200: 'var(--color-gray-200)',
    300: 'var(--color-gray-300)',
    400: 'var(--color-gray-400)',
    500: 'var(--color-gray-500)',
    600: 'var(--color-gray-600)',
    700: 'var(--color-gray-700)',
    800: 'var(--color-gray-800)',
    900: 'var(--color-gray-900)',
    950: 'var(--color-gray-950)'
  },
  error: {
    25: 'var(--color-error-25)',
    50: 'var(--color-error-50)',
    100: 'var(--color-error-100)',
    200: 'var(--color-error-200)',
    300: 'var(--color-error-300)',
    400: 'var(--color-error-400)',
    500: 'var(--color-error-500)',
    600: 'var(--color-error-600)',
    700: 'var(--color-error-700)',
    800: 'var(--color-error-800)',
    900: 'var(--color-error-900)',
    950: 'var(--color-error-950)'
  },
  warning: {
    25: 'var(--color-warning-25)',
    50: 'var(--color-warning-50)',
    100: 'var(--color-warning-100)',
    200: 'var(--color-warning-200)',
    300: 'var(--color-warning-300)',
    400: 'var(--color-warning-400)',
    500: 'var(--color-warning-500)',
    600: 'var(--color-warning-600)',
    700: 'var(--color-warning-700)',
    800: 'var(--color-warning-800)',
    900: 'var(--color-warning-900)',
    950: 'var(--color-warning-950)'
  },
  success: {
    25: 'var(--color-success-25)',
    50: 'var(--color-success-50)',
    100: 'var(--color-success-100)',
    200: 'var(--color-success-200)',
    300: 'var(--color-success-300)',
    400: 'var(--color-success-400)',
    500: 'var(--color-success-500)',
    600: 'var(--color-success-600)',
    700: 'var(--color-success-700)',
    800: 'var(--color-success-800)',
    900: 'var(--color-success-900)',
    950: 'var(--color-success-950)'
  },
  yellow: {
    25: 'var(--color-yellow-25)',
    50: 'var(--color-yellow-50)',
    100: 'var(--color-yellow-100)',
    200: 'var(--color-yellow-200)',
    300: 'var(--color-yellow-300)',
    400: 'var(--color-yellow-400)',
    500: 'var(--color-yellow-500)',
    600: 'var(--color-yellow-600)',
    700: 'var(--color-yellow-700)',
    800: 'var(--color-yellow-800)',
    900: 'var(--color-yellow-900)',
    950: 'var(--color-yellow-950)'
  }
}

const APP_COLORS_VARIABLE_COLORS = {
  'font-family': 'var(--font-family)',
  'background': 'var(--background)',
  'secondary': 'var(--secondary)',
  'border': 'var(--border-color)',

  'badge-border': 'var(--badge-border-color)',
  'badge-value': 'var(--badge-value-color)',

  'breadcrumb-item-hover-background': 'var(--breadcrumb-item-hover-background-color)',
  'breadcrumb-item-hover-text': 'var(--breadcrumb-item-hover-text-color)',
  'breadcrumb-item-text': 'var(--breadcrumb-item-text-color)',
  'breadcrumb-selected-item-background': 'var(--breadcrumb-selected-item-background-color)',
  'breadcrumb-selected-item-text': 'var(--breadcrumb-selected-item-text-color)',

  'button-background': 'var(--button-background-color)',
  'button-background-hover': 'var(--button-background-hover-color)',
  'button-text': 'var(--button-text-color)',
  'button-border-radius': 'var(--button-border-radius)',

  'outline-button-border': 'var(--outline-button-border-color)',
  'outline-button-text': 'var(--outline-button-text-color)',
  'outline-button-hover-background': 'var(--outline-button-hover-background-color)',
  'outline-button-hover-border': 'var(--outline-button-hover-border-color)',
  'outline-button-hover-text': 'var(--outline-button-hover-text-color)',

  'input-background': 'var(--input-background-color)',
  'input-border': 'var(--input-border-color)',
  'input-disabled-background': 'var(--input-disabled-background-color)',
  'input-disabled-border': 'var(--input-disabled-border-color)',
  'input-disabled-placeholder': 'var(--input-disabled-placeholder-color)',
  'input-disabled-text': 'var(--input-disabled-text-color)',
  'input-focus-border': 'var(--input-focus-border-color)',
  'input-focus-placeholder': 'var(--input-focus-placeholder-color)',
  'input-focus-text': 'var(--input-focus-text-color)',
  'input-placeholder': 'var(--input-placeholder-color)',
  'input-text': 'var(--input-text-color)',

  'menu-background': 'var(--menu-background-color)',
  'menu-item-selected-background': 'var(--menu-item-selected-background-color)',
  'menu-item-text': 'var(--menu-item-text-color)',

  'modal-background': 'var(--modal-background-color)',
  'modal-border': 'var(--modal-border-color)',

  'paginator-button-background': 'var(--paginator-button-background-color)',
  'paginator-button-disabled-background': 'var(--paginator-button-disabled-background-color)',
  'paginator-text': 'var(--paginator-text-color)',
  'paginator-value-background': 'var(--paginator-value-background-color)',

  'popover-background': 'var(--popover-background-color)',
  'popover-border': 'var(--popover-border-color)',
  'popover-text': 'var(--popover-text-color)',

  'radio-border': 'var(--radio-border-color)',
  'radio-selected': 'var(--radio-selected-color)',

  'select-options-container-background': 'var(--select-options-container-background-color)',
  'select-options-container-border': 'var(--select-options-container-border-color)',
  'select-options-selected-background': 'var(--select-options-selected-background-color)',
  'select-search-container-background': 'var(--select-search-container-background-color)',
  'select-search-container-border': 'var(--select-search-container-border-color)',

  'table-background': 'var(--table-background-color)',
  'table-border': 'var(--table-border-color)',
  'table-header-background': 'var(--table-header-background-color)',
  'table-header-text': 'var(--table-header-text-color)',
  'table-header-input-background': 'var(--table-header-input-background-color)',
  'table-footer-background': 'var(--table-footer-background-color)',
  'table-separator': 'var(--table-separator-color)',
  'table-row': 'var(--table-row-color)',
  'table-row-hover': 'var(--table-row-hover-color)',
  'table-row-text': 'var(--table-row-text-color)',

  'switch-unchecked-background': 'var(--switch-unchecked-background-color)',
  'switch-unchecked-border': 'var(--switch-unchecked-border-color)',
  'switch-unchecked-thumb': 'var(--switch-thumb-background-color)',
  'switch-thumb-background': 'var(--switch-thumb-background-color)',
  'switch-thumb-border': 'var(--switch-thumb-border-color)',
  'switch-thumb-padding': 'var(--switch-thumb-padding)',
  'switch-thumb-size': 'var(--switch-thumb-size)',
  'switch-checked-background': 'var(--switch-checked-background-color)',
  'switch-checked-border': 'var(--switch-checked-border-color)',
  'switch-checked-thumb': 'var(--switch-checked-thumb-background-color)',

  'text-default': 'var(--text-default-color)',
  'text-muted': 'var(--text-muted-color)',

  'toast-background': 'var(--toast-background-color)',
  'toast-border': 'var(--toast-border-color)',
  'toast-text': 'var(--toast-text-color)',

  'tree-item-hover-background': 'var(--tree-item-hover-background-color)',
  'tree-item-text': 'var(--tree-item-text-color)',
  'tree-table-background': 'var(--tree-table-background-color)',

  'info': 'var(--info)',
  'info-foreground': 'var(--info-foreground)',

  'zebra-background-1': 'var(--zebra-background-1)',
  'zebra-background-2': 'var(--zebra-background-2)'
}

const SHADCN_VARIABLES = {
  'foreground': 'var(--input-text-color)',
  'card': 'var(--input-background-color)',
  'card-foreground': 'var(--input-text-color)',
  'popover': 'var(--popover-background-color)',
  'popover-foreground': 'var(--popover-text-color)',
  'muted': 'var(--input-disabled-background-color)',
  'muted-foreground': 'var(--input-placeholder-color)',
  'accent': 'var(--select-options-selected-background-color)',
  'accent-foreground': 'var(--input-text-color)',
  'destructive': 'var(--color-error-500)',
  'destructive-foreground': 'var(--color-gray-25)',
  'input': 'var(--input-border-color)',
  'ring': 'var(--input-focus-border-color)'
}

const config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    extend: {
      colors: {
        ...APP_COLORS,
        ...APP_COLORS_VARIABLE_COLORS,
        ...SHADCN_VARIABLES
      },
      borderRadius: {
        lg: 'var(--border-radius)',
        md: 'calc(var(--border-radius) - 2px)',
        sm: 'calc(var(--border-radius) - 4px)',
        table: 'var(--table-border-radius)',
        card: 'var(--card-border-radius)',
        button: 'var(--button-border-radius)',
      },
      maxWidth: {
        'content-container': '2440px'
      },
      height: {
        'screen-mobile': 'calc(var(--mobile-vh, 1vh) * 100)',
        'dvh': '100dvh',
      },
      minHeight: {
        'screen-mobile': 'calc(var(--mobile-vh, 1vh) * 100)',
        'dvh': '100dvh',
      },
      maxHeight: {
        'screen-mobile': 'calc(var(--mobile-vh, 1vh) * 100)',
        'dvh': '100dvh',
      }
    }
  },
} satisfies Config

export default config
