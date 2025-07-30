import { ApiResultType } from "@/types/app";
import { ESPSensorDataSchema, ESPSensorData } from "@/types/esp";

/**
 * Fetches the latest sensor data from the ESP API.
 */
async function getESPSensorData(): Promise<ApiResultType<ESPSensorData>> {
  const successMessage = "传感器数据获取成功";
  const failureMessage = "传感器数据获取失败";

  const apiUrl = "/api/sensor";

  try {
    const res = await fetch(apiUrl, { credentials: "include" }).then((res) => res.json());
    const parsed = ESPSensorDataSchema.safeParse({ ...res, date: new Date().toISOString() });
    if (parsed.success) return { success: true, message: successMessage, data: parsed.data };
    else return { success: false, message: failureMessage, detail: parsed.error.message };
  } catch (err) {
    console.error(err);
    const detail = err instanceof Error ? err.message : String(err);
    return { success: false, message: failureMessage, detail };
  }
}

export const ESPSensorAPI = {
  get: getESPSensorData
};
