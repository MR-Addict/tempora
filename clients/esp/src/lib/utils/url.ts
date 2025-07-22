function join(...args: string[]): string {
	// Join the provided path segments, ensuring no leading or trailing slashes
	return args.map((arg) => arg.replace(/(^\/+|\/+$)/g, '')).join('/');
}

/**
 * Constructs a URL by joining the base URL with the provided path segments.
 *
 * @param paths - An array of path segments to join with the base URL.
 * @returns A complete URL string constructed from the base URL and the provided paths.
 */
export default function url(...paths: string[]): string {
	let baseUrl = window.location.origin;

	// If running on localhost, use the environment variable for the ESP server URL
	if (window.location.hostname === 'localhost') {
		const envUrl = import.meta.env.VITE_ESP_SERVER_URL;
		if (envUrl) baseUrl = envUrl;
		else console.warn('No VITE_ESP_SERVER_URL set, using fallback:', baseUrl);
	}

	// Join the paths with the base URL
	return new URL(join(...paths), baseUrl).toString();
}
