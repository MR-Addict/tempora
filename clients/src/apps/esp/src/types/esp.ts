import { z } from "zod";

export const ESPConfigSchema = z.object({
  /**
   * Device id
   */
  id: z.string(),
  /**
   * Device name
   */
  name: z.string(),
  /**
   * Device baudrate
   */
  baudrate: z.number(),

  /**
   * Device pins configuration
   *
   * When a pin is not used, it should be set to -1.
   */
  pins: z.object({
    led: z.number(),
    button: z.number(),
    sda: z.number(),
    scl: z.number()
  }),

  /**
   * Device WiFi SSID
   */
  ssid: z.string(),
  /**
   * Device WiFI password
   */
  password: z.string()
});
export type ESPConfig = z.infer<typeof ESPConfigSchema>;

export const ESPStatusSchema = z.object({
  led_connected: z.boolean(),
  button_connected: z.boolean(),
  wifi_connected: z.boolean(),
  sensor_connected: z.boolean(),
  sta: z.boolean(),
  rssi: z.number(),
  ssid: z.string(),
  ip: z.string(),
  mac: z.string(),
  hostname: z.string()
});
export type ESPStatus = z.infer<typeof ESPStatusSchema>;

export const ESPSensorDataSchema = z.object({
  /**
   * Sensor temperature in Celsius
   */
  temperature: z.number(),
  /**
   * Sensor humidity in percentage
   */
  humidity: z.number(),
  /**
   * Indicates if the sensor data is valid
   *
   * When it's false, the temperature and humidity values should not be used.
   */
  valid: z.boolean()
});
export type ESPSensorData = z.infer<typeof ESPSensorDataSchema>;
