import { useLocation } from "react-router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { useTheme } from "@pkgs/hooks";
import type { ThemeType } from "@pkgs/hooks";
import { usePersistantState } from "@pkgs/hooks";

import { ApiResultType } from "@/types/app";
import { ESPConfig, ESPSensorData } from "@/types/esp";
import { ESPConfigAPI } from "@/api/ESPConfigAPI";
import { ESPSensorAPI } from "@/api/ESPSensorAPI";

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
   * The current ESP configuration.
   */
  config: {
    data: ApiResultType<ESPConfig> | null;
    refresh: () => Promise<void>;
    update: (newConfig: Partial<ESPConfig>) => Promise<ApiResultType<ESPConfig>>;
  };

  /**
   * The latest sensor data from the ESP.
   */
  sensor: {
    data: ApiResultType<ESPSensorData> | null;
    refresh: () => Promise<void>;
  };

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

  config: {
    data: null,
    refresh: async () => {},
    update: async () => ({ success: false, message: "Not implemented" })
  },

  sensor: {
    data: null,
    refresh: async () => {}
  },

  pathname: "/"
});

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useTheme("system");
  const [openSidebar, setOpenSidebar] = usePersistantState("open-sidebar", false);

  const [config, setConfig] = useState<ApiResultType<ESPConfig> | null>(null);
  const [sensor, setSensor] = useState<ApiResultType<ESPSensorData> | null>(null);

  const location = useLocation();
  const pathname = useMemo(() => location.pathname.split("/").slice(0, 2).join("/"), [location.pathname]);

  async function refreshConfig() {
    setConfig(await ESPConfigAPI.get());
  }

  async function updateConfig(newConfig: Partial<ESPConfig>) {
    const res = await ESPConfigAPI.update(newConfig);
    setConfig(res);
    return res;
  }

  async function refreshSensor() {
    setSensor(await ESPSensorAPI.get());
  }

  useEffect(() => {
    refreshConfig();
    refreshSensor();
  }, []);

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,

        openSidebar,
        setOpenSidebar,

        config: {
          data: config,
          refresh: refreshConfig,
          update: updateConfig
        },

        sensor: {
          data: sensor,
          refresh: refreshSensor
        },

        pathname
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
