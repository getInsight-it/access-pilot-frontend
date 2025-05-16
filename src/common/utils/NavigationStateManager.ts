export interface NavigationState {
  previousRoute: string;
  data?: any;
}

const NAVIGATION_STATE_KEY = 'app_navigation_state';

export const savePreviousRoute = (route: string, data?: any) => {
  try {
    const state: NavigationState = {
      previousRoute: route,
      data
    };
    localStorage.setItem(NAVIGATION_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Erro ao salvar rota anterior:', error);
  }
};

export const getPreviousRoute = (): NavigationState | null => {
  try {
    const stateStr = localStorage.getItem(NAVIGATION_STATE_KEY);
    if (!stateStr) return null;

    return JSON.parse(stateStr);
  } catch (error) {
    console.error('Erro ao recuperar rota anterior:', error);
    return null;
  }
};

export const goToPreviousRoute = (
  navigate: (to: string) => void,
  fallbackRoute: string = '/dashboard'
): any => {
  const previousState = getPreviousRoute();

  if (previousState && previousState.previousRoute) {
    navigate(previousState.previousRoute);
    return previousState.data;
  } else {
    navigate(fallbackRoute);
    return null;
  }
};
