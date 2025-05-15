import { useRef, useEffect, useCallback } from "react";

export interface UseLazyLoadOptions extends IntersectionObserverInit {
  once?: boolean;
  oncePerElement?: boolean;
}

export function useLazyLoad<Args extends any[]>(
  onLoad: (...args: Args) => void | Promise<void>,
  args: Args,
  options: UseLazyLoadOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0,
  }
) {
  const observer = useRef<IntersectionObserver>();
  const hasLoadedGlobal = useRef(false);
  const loadedElements = useRef<WeakSet<Element>>(new WeakSet());
  const handleIntersect = useCallback(
    (entry: IntersectionObserverEntry) => {
      onLoad(...args);
      hasLoadedGlobal.current = true;
      loadedElements.current.add(entry.target);
      if (options.once) {
        observer.current?.disconnect();
      }
    },
    [onLoad, ...args, options.once]
  );

  const sentinelRef = useCallback(
    (node: Element | null) => {
      observer.current?.disconnect();

      if (!node) return;

      if (options.once && hasLoadedGlobal.current) {
        return;
      }

      if (options.oncePerElement && loadedElements.current.has(node)) {
        return;
      }

      observer.current = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          handleIntersect(entry);
          if (options.oncePerElement) {
            observer.current?.disconnect();
          }
        }
      }, options);

      observer.current.observe(node);
    },
    [
      handleIntersect,
      options.once,
      options.oncePerElement,
    ]
  );

  useEffect(() => {
    return () => {
      observer.current?.disconnect();
    };
  }, []);

  return sentinelRef;
}
