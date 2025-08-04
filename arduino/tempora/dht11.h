#ifndef DHT11_H
#define DHT11_H

#define DHT11_TIMEOUT 1e5
#define DHT11_OKAY 0x00
#define DHT11_ERROR 0x01

struct DHT11Data {
  // Temperature in degrees Celsius
  float temperature;

  // Humidity in percentage
  uint8_t humidity;

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

class DHT11 {
private:
  bool ready;
  uint8_t _sensorPin;
  DHT11Data _lastData;
  unsigned long _lastReadTime;

  uint32_t getLowTime() {
    uint32_t lastTime = micros();
    while (!digitalRead(_sensorPin)) {
      if (micros() - lastTime > DHT11_TIMEOUT) {
        break;
      }
    }
    return (micros() - lastTime);
  }

  uint32_t getHighTime() {
    uint32_t lastTime = micros();
    while (digitalRead(_sensorPin)) {
      if (micros() - lastTime > DHT11_TIMEOUT) {
        break;
      }
    }
    return (micros() - lastTime);
  }

public:
  DHT11() {}

  // Initialize the sensor
  bool begin(uint8_t sensorPin = -1) {
    _lastReadTime = 0;
    _sensorPin = sensorPin;
    _lastData = { 0.0, 0, false };

    if (sensorPin == -1) {
      ready = false;
      return false;
    }

    ready = true;
    return true;
  }

  bool available() {
    return ready;
  }

  DHT11Data readData() {
    if (!available()) {
      return _lastData;
    }

    // 距离上次读取时间小于5秒，直接返回上次数据
    if (millis() - _lastReadTime < 5000) {
      return _lastData;
    }

    /*MCU发送开始信号, 并等待应答*/
    pinMode(_sensorPin, OUTPUT);
    //拉低18ms
    digitalWrite(_sensorPin, LOW);
    delay(18);
    //拉高40us
    digitalWrite(_sensorPin, HIGH);
    delayMicroseconds(40);

    /*接受DHT11做出的应答*/
    pinMode(_sensorPin, INPUT_PULLUP);
    getLowTime();
    getHighTime();

    /*开始接受40bit数据*/
    uint8_t buffer[5] = { 0 };
    for (uint8_t i = 0; i < 5; i++) {
      for (uint8_t j = 0; j < 8; j++) {
        getLowTime();
        if (getHighTime() > 50)
          buffer[i] |= (0x80 >> j);
      }
    }

    /*结束通信*/
    getLowTime();

    /*检查校验和*/
    if (buffer[0] + buffer[1] + buffer[2] + buffer[3] != buffer[4]) {
      return _lastData;
    }

    /*更新数据*/
    _lastReadTime = millis();
    _lastData.humidity = buffer[0];
    _lastData.temperature = buffer[2] + buffer[3] * 0.1;
    _lastData.valid = true;

    return _lastData;
  }

  float readTemperature() {
    DHT11Data data = readData();
    return data.valid ? data.temperature : NAN;
  }

  uint8_t readHumidity() {
    DHT11Data data = readData();
    return data.valid ? data.humidity : 0;
  }
};

#endif