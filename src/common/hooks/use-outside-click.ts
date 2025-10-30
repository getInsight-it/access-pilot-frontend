import React, { useEffect } from "react";

/**
 * Hook that triggers a callback when user clicks outside the referenced element
 * Useful for closing dropdowns, modals, and other overlay components
 *
 * @param ref - React ref to the element to detect outside clicks for
 * @param callback - Function to call when outside click is detected
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * useOutsideClick(ref, () => setIsOpen(false));
 */
export const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement>,
  callback: (event: MouseEvent | TouchEvent) => void
): void => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent): void => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      callback(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
};
