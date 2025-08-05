import { useLocation } from "react-router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { useTheme } from "@pkgs/hooks";
import { usePersistantState } from "@pkgs/hooks";
import type { ThemeType } from "@pkgs/hooks";

import { ApiResultType } from "@/types/app";
import { ESPConfigAPI } from "@/api/ESPConfigAPI";
import { ESPSensorAPI } from "@/api/ESPSensorAPI";
import { ESPStatusAPI } from "@/api/ESPStatusAPI";
import { ESPConfig, ESPSensorData, ESPStatus } from "@/types/esp";

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
    refresh: () => Promise<ApiResultType<ESPConfig>>;
    update: (newConfig: Partial<ESPConfig>) => Promise<ApiResultType<ESPConfig>>;
  };

  /**
   * The latest sensor data from the ESP.
   */
  sensor: {
    data: ApiResultType<ESPSensorData> | null;
    refresh: () => Promise<ApiResultType<ESPSensorData>>;
  };

  /**
   * The current status of the ESP.
   */
  status: {
    data: ApiResultType<ESPStatus> | null;
    refresh: () => Promise<ApiResultType<ESPStatus>>;
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
    refresh: async () => ({ success: false, message: "" }),
    update: async () => ({ success: false, message: "" })
  },

  sensor: {
    data: null,
    refresh: async () => ({ success: false, message: "" })
  },

  status: {
    data: null,
    refresh: async () => ({ success: false, message: "" })
  },

  pathname: "/"
});

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useTheme("system");
  const [openSidebar, setOpenSidebar] = usePersistantState("open-sidebar", false);

  const [config, setConfig] = useState<ApiResultType<ESPConfig> | null>(null);
  const [sensor, setSensor] = useState<ApiResultType<ESPSensorData> | null>(null);
  const [status, setStatus] = useState<ApiResultType<ESPStatus> | null>(null);

  const location = useLocation();
  const pathname = useMemo(() => location.pathname.split("/").slice(0, 2).join("/"), [location.pathname]);

  async function refreshConfig() {
    const res = await ESPConfigAPI.get();
    setConfig(res);
    return res;
  }

  async function updateConfig(newConfig: Partial<ESPConfig>) {
    const res = await ESPConfigAPI.update(newConfig);
    setConfig(res);
    return res;
  }

  async function refreshSensor() {
    const res = await ESPSensorAPI.get();
    setSensor(res);
    return res;
  }

  async function refreshStatus() {
    const res = await ESPStatusAPI.get();
    setStatus(res);
    return res;
  }

  useEffect(() => {
    const fetchData = async () => await Promise.all([refreshConfig(), refreshSensor(), refreshStatus()]);
    const intervalId = setInterval(fetchData, 3000);
    fetchData();
    return () => clearInterval(intervalId);
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

        status: {
          data: status,
          refresh: refreshStatus
        },

        pathname
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
