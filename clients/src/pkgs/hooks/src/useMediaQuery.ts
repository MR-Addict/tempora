import { useEffect, useState } from "react";

/**
 * A custom hook that detects media query matches.
 *
 * @param query Media query string to match against, e.g., "(max-width: 600px)".
 * @param callback Optional callback function that is called when the media query match changes.
 * @param deps Optional dependency array to control when the effect runs.
 * @returns A boolean state indicating whether the media query matches.
 */
export function useMediaQuery(query: string, callback?: (matched: boolean) => void, deps?: React.DependencyList) {
  const [matched, setMatched] = useState(false);

  useEffect(() => {
    const mediaQuery = matchMedia(query);

    const handleChange = () => {
      setMatched(mediaQuery.matches);
      callback && callback(mediaQuery.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    setMatched(mediaQuery.matches);
    callback && callback(mediaQuery.matches);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, deps);

  return matched;
}
