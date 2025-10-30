let resizeTimeout: number | null = null;

function updateMobileVH(): void {
  const vh = window.innerHeight * 0.01;

  document.documentElement.style.setProperty('--mobile-vh', `${vh}px`);
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

function debouncedUpdateMobileVH(): void {
  if (resizeTimeout !== null) {
    clearTimeout(resizeTimeout);
  }

  resizeTimeout = window.setTimeout(() => {
    updateMobileVH();
    resizeTimeout = null;
  }, 100);
}

export function initMobileViewportFix(): void {
  updateMobileVH();

  window.addEventListener('resize', debouncedUpdateMobileVH);
  window.addEventListener('orientationchange', () => {
    setTimeout(updateMobileVH, 100);
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      updateMobileVH();
    }
  });

  let scrollTimeout: number | null = null;
  window.addEventListener('scroll', () => {
    if (scrollTimeout !== null) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = window.setTimeout(updateMobileVH, 200);
  }, { passive: true });
}
