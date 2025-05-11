import { useRef, useEffect, useCallback } from "react";

export interface UseLazyLoadOptions extends IntersectionObserverInit {
  /** dispara apenas uma vez globalmente (como antes) */
  once?: boolean;
  /** dispara apenas uma vez **por cada elemento** */
  oncePerElement?: boolean;
}

/**
 * onLoad pode receber zero ou N parâmetros e retornar void ou Promise<void>.
 * args é uma tupla com esses parâmetros.
 */
export function useLazyLoad<Args extends any[]>(
  onLoad: (...args: Args) => void | Promise<void>,
  args: Args,
  options: UseLazyLoadOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0,
  }
) {
  // Observer e memória de elementos já “carregados”
  const observer = useRef<IntersectionObserver>();
  const hasLoadedGlobal = useRef(false);
  const loadedElements = useRef<WeakSet<Element>>(new WeakSet());

  // callback memoizada
  const handleIntersect = useCallback(
    (entry: IntersectionObserverEntry) => {
      onLoad(...args);
      hasLoadedGlobal.current = true;
      loadedElements.current.add(entry.target);
      // se for only-once global, desconecta tudo
      if (options.once) {
        observer.current?.disconnect();
      }
    },
    [onLoad, ...args, options.once]
  );

  // ref callback para o sentinel
  const sentinelRef = useCallback(
    (node: Element | null) => {
      // desconecta observer antigo
      observer.current?.disconnect();

      if (!node) return;

      // se once global e já carregou, não faz mais nada
      if (options.once && hasLoadedGlobal.current) {
        return;
      }

      // se once per element e já carregou esse elemento, pula
      if (options.oncePerElement && loadedElements.current.has(node)) {
        return;
      }

      observer.current = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          handleIntersect(entry);
          // se for oncePerElement, desconecta só deste node
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
      // reparou que não colocamos loadedElements na lista?
      // não precisa: a ref nunca troca de instância
    ]
  );

  // cleanup no unmount
  useEffect(() => {
    return () => {
      observer.current?.disconnect();
    };
  }, []);

  return sentinelRef;
}
