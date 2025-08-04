#ifndef CONFIG_H
#define CONFIG_H

#include "utils.h"

struct ConfigStruct {
  String id;
  String name;
  String token;
  int baudrate;

  struct {
    int led;
    int button;
    int sensor;
  } pins;

  struct {
    String ssid;
    String password;
  } wifi;

  String remote_server;
};

class DeviceConfig {
private:
  Preferences preferences;
  const char* CONFIG_NAMESPACE = "config";

public:
  ConfigStruct deviceConfig;

  DeviceConfig() {}

  bool begin() {
    if (load()) {
      if (deviceConfig.id == "") reset();
      return true;
    } else return false;
  }

  bool reset() {
    if (deviceConfig.id == "") deviceConfig.id = Utils::generateID();
    deviceConfig.name = "tempora-" + deviceConfig.id;
    deviceConfig.token = "";
    deviceConfig.baudrate = 115200;

    deviceConfig.pins.led = -1;
    deviceConfig.pins.button = -1;
    deviceConfig.pins.sensor = -1;

    deviceConfig.wifi.ssid = "";
    deviceConfig.wifi.password = "";

    deviceConfig.remote_server = "";

    save();

    return true;
  }

  bool load() {
    if (!preferences.begin(CONFIG_NAMESPACE, true)) return false;

    deviceConfig.id = preferences.getString("id", "");
    deviceConfig.name = preferences.getString("name", "");
    deviceConfig.token = preferences.getString("token", "");
    deviceConfig.baudrate = preferences.getInt("baudrate", 115200);

    deviceConfig.pins.led = preferences.getInt("pins.led", -1);
    deviceConfig.pins.button = preferences.getInt("pins.button", -1);
    deviceConfig.pins.sensor = preferences.getInt("pins.sensor", -1);

    deviceConfig.wifi.ssid = preferences.getString("wifi.ssid", "");
    deviceConfig.wifi.password = preferences.getString("wifi.password", "");

    deviceConfig.remote_server = preferences.getString("remote_server", "");
    preferences.end();

    return true;
  }

  bool save() {
    if (!preferences.begin(CONFIG_NAMESPACE, false)) return false;

    preferences.putString("id", deviceConfig.id);
    preferences.putString("name", deviceConfig.name);
    preferences.putString("token", deviceConfig.token);
    preferences.putInt("baudrate", deviceConfig.baudrate);

    preferences.putInt("pins.led", deviceConfig.pins.led);
    preferences.putInt("pins.button", deviceConfig.pins.button);
    preferences.putInt("pins.sensor", deviceConfig.pins.sensor);

    preferences.putString("wifi.ssid", deviceConfig.wifi.ssid);
    preferences.putString("wifi.password", deviceConfig.wifi.password);

    preferences.putString("remote_server", deviceConfig.remote_server);
    preferences.end();

    return true;
  }

  // Serialize config to JSON string
  String toJson() {
    DynamicJsonDocument doc(1024);

    doc["id"] = deviceConfig.id;
    doc["name"] = deviceConfig.name;
    doc["token"] = deviceConfig.token;
    doc["baudrate"] = deviceConfig.baudrate;

    JsonObject pins = doc.createNestedObject("pins");
    pins["led"] = deviceConfig.pins.led;
    pins["button"] = deviceConfig.pins.button;
    pins["sensor"] = deviceConfig.pins.sensor;

    JsonObject wifi = doc.createNestedObject("wifi");
    wifi["ssid"] = deviceConfig.wifi.ssid;
    wifi["password"] = deviceConfig.wifi.password;

    doc["remote_server"] = deviceConfig.remote_server;

    String jsonString;
    serializeJson(doc, jsonString);
    return jsonString;
  }

  // Parse JSON string and update config
  bool fromJson(const String& jsonString) {
    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, jsonString);

    if (error) return false;

    if (doc.containsKey("name")) deviceConfig.name = doc["name"].as<String>();
    if (doc.containsKey("token")) deviceConfig.token = Utils::hash(doc["token"].as<String>());
    if (doc.containsKey("baudrate")) deviceConfig.baudrate = doc["baudrate"];

    if (doc.containsKey("pins")) {
      JsonObject pins = doc["pins"];
      if (pins.containsKey("led")) deviceConfig.pins.led = pins["led"];
      if (pins.containsKey("button")) deviceConfig.pins.button = pins["button"];
      if (pins.containsKey("sensor")) deviceConfig.pins.sensor = pins["sensor"];
    }

    if (doc.containsKey("wifi")) {
      JsonObject wifi = doc["wifi"];
      if (wifi.containsKey("ssid")) deviceConfig.wifi.ssid = wifi["ssid"].as<String>();
      if (wifi.containsKey("password")) deviceConfig.wifi.password = wifi["password"].as<String>();
    }

    if (doc.containsKey("remote_server")) deviceConfig.remote_server = doc["remote_server"].as<String>();

    save();

    return true;
  }

  // Getters for easy access
  String getId() {
    return deviceConfig.id;
  }
  String getName() {
    return deviceConfig.name;
  }
  String getToken() {
    return deviceConfig.token;
  }
  String getWiFiSSID() {
    return deviceConfig.wifi.ssid;
  }
  String getWiFiPassword() {
    return deviceConfig.wifi.password;
  }
  String getRemoteServer() {
    return deviceConfig.remote_server;
  }
  int getPinsLed() {
    return deviceConfig.pins.led;
  }
  int getPinsButton() {
    return deviceConfig.pins.button;
  }
  int getPinsSensor() {
    return deviceConfig.pins.sensor;
  }
  int getBaudrate() {
    return deviceConfig.baudrate;
  }
};

#endif  // CONFIG_H
