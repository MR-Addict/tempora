import { useEffect, useState } from "react";

export interface Dimension {
  /**
   * The width of the element in pixels.
   */
  width: number;

  /**
   * The height of the element in pixels.
   */
  height: number;
}

/**
 *
 * @param ref A React ref object pointing to the element whose dimensions you want to track.
 * @returns An object containing the width and height of the element.
 */
export function useDimensions<T extends Element = HTMLDivElement>(ref: React.RefObject<T>) {
  const [dimensions, setDimensions] = useState<Dimension>({ width: 0, height: 0 });

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      });
    });

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref.current]);

  return dimensions;
}
