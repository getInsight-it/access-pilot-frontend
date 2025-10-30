export interface NavigationState<T = unknown> {
  previousRoute: string;
  data?: T;
}

const NAVIGATION_STATE_KEY = "app_navigation_state";

/**
 * Saves the previous route and optional data to localStorage
 * Silently fails if localStorage is unavailable (e.g., private browsing)
 *
 * @param route - The route path to save
 * @param data - Optional data to store with the route
 */
export const savePreviousRoute = <T = unknown>(route: string, data?: T): void => {
  const state: NavigationState<T> = {
    previousRoute: route,
    data
  };

  localStorage.setItem(NAVIGATION_STATE_KEY, JSON.stringify(state));
};

/**
 * Retrieves the previous route and data from localStorage
 * Returns null if no state is saved or if localStorage is unavailable
 *
 * @returns The saved navigation state or null
 */
export const getPreviousRoute = <T = unknown>(): NavigationState<T> | null => {
  const stateStr = localStorage.getItem(NAVIGATION_STATE_KEY);
  if (!stateStr) return null;

  return JSON.parse(stateStr) as NavigationState<T>;
};

/**
 * Navigates to the previous route if available, otherwise to fallback route
 * Returns the data associated with the previous route, if any
 *
 * @param navigate - React Router navigate function
 * @param fallbackRoute - Route to navigate to if no previous route exists
 * @returns The data associated with the previous route, or null
 */
export const goToPreviousRoute = <T = unknown>(
  navigate: (to: string) => void,
  fallbackRoute: string = "/dashboard"
): T | null => {
  const previousState = getPreviousRoute<T>();

  if (previousState?.previousRoute) {
    navigate(previousState.previousRoute);
    return previousState.data ?? null;
  } else {
    navigate(fallbackRoute);
    return null;
  }
};
