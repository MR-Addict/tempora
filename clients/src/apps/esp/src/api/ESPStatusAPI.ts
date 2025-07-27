import { ApiResultType } from "@/types/app";
import { ESPStatusSchema, ESPStatus } from "@/types/esp";

/**
 * Fetches the current status from the ESP API.
 */
async function getESPStatus(): Promise<ApiResultType<ESPStatus>> {
  const successMessage = "ESP状态获取成功";
  const failureMessage = "ESP状态获取失败";

  const apiUrl = "/api/status";

  try {
    const res = await fetch(apiUrl, { credentials: "include" }).then((res) => res.json());
    const parsed = ESPStatusSchema.safeParse(res);
    if (parsed.success) return { success: true, message: successMessage, data: parsed.data };
    else return { success: false, message: failureMessage, detail: parsed.error.message };
  } catch (err) {
    console.error(err);
    const detail = err instanceof Error ? err.message : String(err);
    return { success: false, message: failureMessage, detail };
  }
}

export const ESPStatusAPI = {
  get: getESPStatus
};
