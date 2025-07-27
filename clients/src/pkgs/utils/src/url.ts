function join(...args: string[]): string {
  // Join the provided path segments, ensuring no leading or trailing slashes
  return args.map((arg) => arg.replace(/(^\/+|\/+$)/g, "")).join("/");
}

/**
 * Constructs a URL by joining the base URL with the provided path segments.
 *
 * @param paths - An array of path segments to join with the base URL.
 * @returns A complete URL string constructed from the base URL and the provided paths.
 */
export function url(...paths: string[]): string {
  const windowUrl = window.location.origin;
  // @ts-expect-error
  const envUrl: string | undefined = import.meta.env.VITE_ESP_URL;

  let baseUrl = windowUrl;
  // If an environment variable is set, use it as the base URL
  if (envUrl) baseUrl = envUrl;
  // If the current URL is localhost, use the environment variable if available
  else if (windowUrl.includes("localhost")) {
    if (envUrl) baseUrl = envUrl;
    else console.warn("No VITE_ESP_URL set, using current location:", baseUrl);
  }

  // Join the paths with the base URL
  return new URL(join(...paths), baseUrl).toString();
}
