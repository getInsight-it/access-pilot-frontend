let resizeTimeout: number | null = null;

function updateMobileVH() {
  const vh = window.innerHeight * 0.01;

  document.documentElement.style.setProperty('--mobile-vh', `${vh}px`);
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

function debouncedUpdateMobileVH() {
  if (resizeTimeout !== null) {
    clearTimeout(resizeTimeout);
  }

  resizeTimeout = window.setTimeout(() => {
    updateMobileVH();
    resizeTimeout = null;
  }, 100);
}

export function initMobileViewportFix() {
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

export function cleanupMobileViewportFix() {
  window.removeEventListener('resize', debouncedUpdateMobileVH);
  window.removeEventListener('orientationchange', updateMobileVH);
  document.removeEventListener('visibilitychange', updateMobileVH);

  if (resizeTimeout !== null) {
    clearTimeout(resizeTimeout);
  }
}
