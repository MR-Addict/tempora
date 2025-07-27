import { ApiResultType } from "@/types/app";
import { ESPConfig, ESPConfigSchema } from "@/types/esp";

/**
 * Fetches the ESP configuration from the API.
 */
async function getESPConfig(): Promise<ApiResultType<ESPConfig>> {
  const successMessage = "配置信息获取成功";
  const failureMessage = "配置信息获取失败";

  const apiUrl = "/api/config";

  try {
    const res = await fetch(apiUrl, { credentials: "include" });
    if (!res.ok) return { success: false, message: (await res.text()) || failureMessage };

    const parsed = ESPConfigSchema.safeParse(await res.json());
    if (parsed.success) return { success: true, message: successMessage, data: parsed.data };
    else return { success: false, message: failureMessage, detail: parsed.error.message };
  } catch (err) {
    console.error(err);
    const detail = err instanceof Error ? err.message : String(err);
    return { success: false, message: failureMessage, detail };
  }
}

/**
 * Updates the ESP configuration via the API.
 *
 * @param config - The new configuration to set.
 */
async function updateESPConfig(config: Partial<ESPConfig>): Promise<ApiResultType<ESPConfig>> {
  const successMessage = "ESP配置信息更新成功";
  const failureMessage = "ESP配置信息更新失败";

  const apiUrl = "/api/config";

  try {
    const res = await fetch(apiUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: JSON.stringify(config)
    });
    if (!res.ok) return { success: false, message: (await res.text()) || failureMessage };

    const parsed = ESPConfigSchema.safeParse(await res.json());
    if (parsed.success) return { success: true, message: successMessage, data: parsed.data };
    else return { success: false, message: failureMessage, detail: parsed.error.message };
  } catch (err) {
    console.error(err);
    const detail = err instanceof Error ? err.message : String(err);
    return { success: false, message: failureMessage, detail };
  }
}

export const ESPConfigAPI = {
  get: getESPConfig,
  update: updateESPConfig
};
