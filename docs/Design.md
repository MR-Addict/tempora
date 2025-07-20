# Tempora Project Design

## Data Structures

```ts
interface Device {
  /**
   * Unique identifier for the device
   */
  id: string;
  /**
   * Name of the device
   */
  name: string;
  /**
   * Baud rate for serial communication
   */
  baudrate: number;

  /**
   * Pins configuration for the device
   */
  pins: {
    /**
     * LED pin number
     */
    led: number;
    /**
     * Button pin number
     */
    button: number;
    /**
     * Sensor data SCL pin number
     */
    scl: number;
    /**
     * Sensor data SDA pin number
     */
    sda: number;
  };

  /**
   * WiFi SSID
   */
  ssid: string;
  /**
   * WiFi password
   */
  password: string;

  /**
   * Remote server URL for data submission
   */
  remote_server: string;
}

interface SensorData {
  /**
   * Unique identifier for the device
   */
  device_id: string;
  /**
   * Timestamp of the data in ISO format
   */
  created_at: string;
  /**
   * Temperature reading in Celsius
   */
  temperature: number;
  /**
   * Humidity reading in percentage
   */
  humidity: number;
}

interface Status {
  /**
   * Indicates if the device is connected to WiFi
   */
  wifi_connected: boolean;
  /**
   * Indicates if the sensor is connected and operational
   */
  sensor_connected: boolean;
  /**
   * Indicates if the device is able to connect to the internet
   */
  network_connected: boolean;
  /**
   * Indicates if the device is connected to the remote server
   */
  remote_server_connected: boolean;
}
```

## Workflow

On power on:

- Check if button pin is pressed
  - If yes, enter AP mode, blink LED
  - If no, check if config exists and valid
    - If no, enter AP mode, blink LED
    - If yes, connect to WiFi and serve the app

On running the app:

- Check if wifi is connected
  - If no, try to reconnect, blink LED
  - If yes, serve the app

Services:

- `/api/sensor` to get sensor data
- `/api/config` to get current config
- `/api/config` to update config
- `/api/reset` to reset the device (clear config, restart)
- `/api/restart` to restart the device
- `/api/status` to get device status (connected, sensor data, etc.)

Pages:

- `/` to show sensor data and status
- `/config` to show and update config

LED behavior:

- Blinking: Device is in AP mode
