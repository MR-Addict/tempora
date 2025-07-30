import { useMemo } from "react";
import { ESPSensorData, ESPStatus } from "@/types/esp";

import style from "./home.module.css";
import { useAppContext } from "@/contexts/App";
import { ApiResultType } from "@/types/app";

function Content({ sensor, status }: { sensor: ESPSensorData; status: ESPStatus }) {
  return (
    <div className={style.content}>
      <div>
        <p className={style.name}>{status.name}</p>
        <p className={style.temperature}>{sensor.temperature.toFixed(0) + "℃"}</p>
        <p className={style.humidity}>{`相对湿度：${sensor.humidity.toFixed(0)}%`}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const { sensor, status } = useAppContext();

  const data = useMemo<ApiResultType<{ sensor: ESPSensorData; status: ESPStatus }> | null>(() => {
    if (!sensor.data || !status.data) return null;

    let message = "";
    if (!sensor.data.success) message = sensor.data.message;
    if (!status.data.success) message = message || status.data.message;
    if (message) return { success: false, message };

    if (sensor.data.success && status.data.success) {
      return {
        success: true,
        message: sensor.data.message,
        data: { sensor: sensor.data.data, status: status.data.data }
      };
    }
    return null;
  }, [sensor.data, status.data]);

  return (
    <div className={style.wrapper}>
      {!data ? <p>传感器数据加载中...</p> : !data.success ? <p>{data.message}</p> : <Content {...data.data} />}
    </div>
  );
}
