import { z } from "zod";
import { useEffect, useState } from "react";

import { useMediaQuery } from "./useMediaQuery";

/**
 * Available themes for the application.
 * - "light": Light theme
 * - "dark": Dark theme
 * - "system": Follows the system's color scheme preference
 */
export const themeList = ["light", "dark", "system"] as const;

/**
 * Zod schema to validate the theme.
 */
export const themeValidator = z.enum(themeList);

/**
 * Type representing the theme, which can be "light", "dark", or "system".
 */
export type ThemeType = z.infer<typeof themeValidator>;

function loadTheme(defaultTheme: ThemeType): ThemeType {
  if (typeof localStorage === "undefined") return defaultTheme;

  const storedTheme = localStorage.getItem("theme");
  const parsed = themeValidator.safeParse(storedTheme);

  if (parsed.success) return parsed.data;
  return defaultTheme;
}

function updateTheme(theme: ThemeType, isDarkMedia: boolean) {
  // Check the theme from user first
  let isDarkMode = theme === "dark";

  // If the theme is system, check the system preference
  if (theme === "system") isDarkMode = isDarkMedia;

  // Set the theme
  document.documentElement.classList.toggle("dark", isDarkMode);
  localStorage.setItem("theme", theme);
}

/**
 *
 * @param defaultTheme Can be "light", "dark", or "system", default is "light"
 * @returns A tuple containing the current theme and a function to set the theme
 */
export function useTheme(defaultTheme: ThemeType = "light") {
  const [theme, setTheme] = useState<ThemeType>(loadTheme(defaultTheme));

  const isDarkMedia = useMediaQuery("(prefers-color-scheme: dark)");

  useEffect(() => updateTheme(theme, isDarkMedia), [theme, isDarkMedia]);

  return [theme, setTheme] as const;
}
