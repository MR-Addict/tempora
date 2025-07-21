#ifndef SHT30_H
#define SHT30_H

#define SHT30_DEFAULT_ADDR 0x44
#define SHT30_CMD_MEAS_HIGHREP 0x2400

struct SHT30Data {
  // Temperature in degrees Celsius
  float temperature;

  // Humidity in percentage
  float humidity;

  // Indicates if the data is valid
  bool valid;

  // Serialize data to JSON string
  String toJson() {
    DynamicJsonDocument doc(256);

    doc["temperature"] = temperature;
    doc["humidity"] = humidity;
    doc["valid"] = valid;

    String jsonString;
    serializeJson(doc, jsonString);
    return jsonString;
  }
};

class SHT30 {
private:
  bool ready;
  uint8_t _address;

  bool writeCommand(uint16_t command) {
    Wire.beginTransmission(_address);
    Wire.write(command >> 8);
    Wire.write(command & 0xFF);
    return (Wire.endTransmission() == 0);
  }

  uint8_t calculateCRC(uint8_t *data, uint8_t length) {
    uint8_t crc = 0xFF;
    for (uint8_t i = 0; i < length; i++) {
      crc ^= data[i];
      for (uint8_t bit = 8; bit > 0; --bit) {
        if (crc & 0x80) {
          crc = (crc << 1) ^ 0x31;
        } else {
          crc = (crc << 1);
        }
      }
    }
    return crc;
  }

public:
  SHT30() {}

  // Initialize the sensor
  bool begin(uint8_t sda = -1, uint8_t scl = -1, uint8_t address = SHT30_DEFAULT_ADDR) {
    _address = address;
    if (sda == -1 || scl == -1) {
      ready = false;
      return false;
    }

    Wire.begin(sda, scl);
    Wire.beginTransmission(_address);
    if (Wire.endTransmission() != 0) {
      ready = false;
      return false;
    }

    ready = true;
    return true;
  }

  SHT30Data readData() {
    SHT30Data result = { 0.0, 0.0, false };

    if (!ready) {
      return result;
    }

    // Send measurement command
    if (!writeCommand(SHT30_CMD_MEAS_HIGHREP)) {
      return result;
    }

    delay(16);  // Wait for measurement

    // Read 6 bytes
    uint8_t bytesReceived = Wire.requestFrom(_address, (uint8_t)6);
    if (bytesReceived != 6) {
      return result;
    }

    uint8_t data[6];
    for (uint8_t i = 0; i < 6; i++) {
      data[i] = Wire.read();
    }

    // Validate CRC for temperature
    if (calculateCRC(&data[0], 2) != data[2]) {
      return result;
    }

    // Validate CRC for humidity
    if (calculateCRC(&data[3], 2) != data[5]) {
      return result;
    }

    // Convert raw data
    uint16_t rawTemp = (data[0] << 8) | data[1];
    uint16_t rawHumidity = (data[3] << 8) | data[4];

    result.temperature = -45.0 + 175.0 * rawTemp / 65535.0;
    result.humidity = 100.0 * rawHumidity / 65535.0;

    // Clamp humidity
    if (result.humidity > 100.0) result.humidity = 100.0;
    if (result.humidity < 0.0) result.humidity = 0.0;

    result.valid = true;
    return result;
  }

  float readTemperature() {
    SHT30Data data = readData();
    return data.valid ? data.temperature : NAN;
  }

  float readHumidity() {
    SHT30Data data = readData();
    return data.valid ? data.humidity : NAN;
  }
};

#endif
