import { useLocation } from "react-router";
import { createContext, useContext, useMemo } from "react";

import { useTheme } from "@pkgs/hooks";
import type { ThemeType } from "@pkgs/hooks";
import { usePersistantState } from "@pkgs/hooks";

interface AppContextProps {
  /**
   * The current theme of the application.
   *
   * @default "system"
   * @see {@link ThemeType}
   */
  theme: ThemeType;
  setTheme: React.Dispatch<React.SetStateAction<ThemeType>>;

  /**
   * Whether the sidebar is open or not.
   *
   * @default false
   */
  openSidebar: boolean;
  setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;

  /**
   * The current pathname of the application.
   */
  pathname: string;
}

const AppContext = createContext<AppContextProps>({
  theme: "system",
  setTheme: () => {},

  openSidebar: false,
  setOpenSidebar: () => {},

  pathname: "/"
});

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useTheme("system");
  const [openSidebar, setOpenSidebar] = usePersistantState("open-sidebar", false);

  const location = useLocation();
  const pathname = useMemo(() => location.pathname.split("/").slice(0, 2).join("/"), [location.pathname]);

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,

        openSidebar,
        setOpenSidebar,

        pathname
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
