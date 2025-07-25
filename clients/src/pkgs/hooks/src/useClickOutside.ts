import { useEffect } from "react";
import type { DependencyList } from "react";

/**
 * A custom hook that detects clicks outside of specified elements.
 *
 * @param handler A function to call when a click outside is detected.
 * @param refs A single ref or an array of refs to the elements to check against.
 * @param deps Optional dependency array to control when the effect runs.
 */
export function useClickOutside<T extends Element = HTMLDivElement>(
  handler: (event?: MouseEvent | TouchEvent) => void,
  refs: React.RefObject<T | null> | React.RefObject<T | null>[],
  deps?: DependencyList
) {
  useEffect(() => {
    const innerListener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (!target || !target.isConnected) return;

      const refArray = Array.isArray(refs) ? refs : [refs];
      const isOutside = refArray.every((ref) => ref.current && !ref.current.contains(target));

      if (isOutside) handler(event);
    };

    const outerListener = () => handler();

    document.addEventListener("mousedown", innerListener);
    document.addEventListener("touchstart", innerListener);
    window.addEventListener("blur", outerListener);

    return () => {
      document.removeEventListener("mousedown", innerListener);
      document.removeEventListener("touchstart", innerListener);
      window.removeEventListener("blur", outerListener);
    };
  }, deps);
}
