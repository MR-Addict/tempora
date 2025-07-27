import { ApiResultType } from "@/types/app";

async function loginESP(password: string): Promise<ApiResultType> {
  const successMessage = "登录成功";
  const failureMessage = "登录失败";

  const apiUrl = "/api/login";

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    const text = await res.text();
    if (!res.ok) return { success: false, message: text || failureMessage };
    return { success: true, message: text || successMessage };
  } catch (err) {
    console.error(err);
    const detail = err instanceof Error ? err.message : String(err);
    return { success: false, message: failureMessage, detail };
  }
}

async function logoutESP(): Promise<ApiResultType> {
  const successMessage = "登出成功";
  const failureMessage = "登出失败";

  const apiUrl = "/api/logout";

  try {
    const res = await fetch(apiUrl, { method: "POST", credentials: "include" });

    const text = await res.text();
    if (!res.ok) return { success: false, message: text || failureMessage };
    return { success: true, message: text || successMessage };
  } catch (err) {
    console.error(err);
    const detail = err instanceof Error ? err.message : String(err);
    return { success: false, message: failureMessage, detail };
  }
}

export const ESPAuthAPI = {
  login: loginESP,
  logout: logoutESP
};
