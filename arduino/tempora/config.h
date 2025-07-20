#ifndef CONFIG_H
#define CONFIG_H

struct ConfigStruct {
  String id;
  String name;
  int baudrate;

  struct {
    int led;
    int button;
    int scl;
    int sda;
  } pins;

  String ssid;
  String password;
  String remote_server;
};

class IDGenerator {
public:
  static String generate(int length = 6) {
    randomSeed(analogRead(0));
    const char charset[] = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    String id = "";
    for (int i = 0; i < length; i++) {
      int index = random(0, sizeof(charset) - 1);
      id += charset[index];
    }
    return id;
  }
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
      if (deviceConfig.id == "") {
        deviceConfig.id = IDGenerator::generate();
        deviceConfig.name = "Tempora-" + deviceConfig.id;
        save();
      }
      return true;
    } else return false;
  }

  bool load() {
    if (!preferences.begin(CONFIG_NAMESPACE, true)) return false;

    deviceConfig.id = preferences.getString("id", "");
    deviceConfig.name = preferences.getString("name", "");
    deviceConfig.baudrate = preferences.getInt("baudrate", 115200);

    deviceConfig.pins.led = preferences.getInt("pin_led", -1);
    deviceConfig.pins.button = preferences.getInt("pin_button", -1);
    deviceConfig.pins.scl = preferences.getInt("pin_scl", -1);
    deviceConfig.pins.sda = preferences.getInt("pin_sda", -1);

    deviceConfig.ssid = preferences.getString("ssid", "");
    deviceConfig.password = preferences.getString("password", "");
    deviceConfig.remote_server = preferences.getString("remote_server", "");
    preferences.end();

    return true;
  }

  bool save() {
    if (!preferences.begin(CONFIG_NAMESPACE, false)) return false;

    preferences.putString("id", deviceConfig.id);
    preferences.putString("name", deviceConfig.name);
    preferences.putInt("baudrate", deviceConfig.baudrate);

    preferences.putInt("pin_led", deviceConfig.pins.led);
    preferences.putInt("pin_button", deviceConfig.pins.button);
    preferences.putInt("pin_scl", deviceConfig.pins.scl);
    preferences.putInt("pin_sda", deviceConfig.pins.sda);

    preferences.putString("ssid", deviceConfig.ssid);
    preferences.putString("password", deviceConfig.password);
    preferences.putString("remote_server", deviceConfig.remote_server);
    preferences.end();

    return true;
  }

  // Serialize config to JSON string
  String toJson() {
    DynamicJsonDocument doc(1024);

    doc["id"] = deviceConfig.id;
    doc["name"] = deviceConfig.name;
    doc["baudrate"] = deviceConfig.baudrate;

    JsonObject pins = doc.createNestedObject("pins");
    pins["led"] = deviceConfig.pins.led;
    pins["button"] = deviceConfig.pins.button;
    pins["scl"] = deviceConfig.pins.scl;
    pins["sda"] = deviceConfig.pins.sda;

    doc["ssid"] = deviceConfig.ssid;
    doc["password"] = deviceConfig.password;
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
    if (doc.containsKey("baudrate")) deviceConfig.baudrate = doc["baudrate"];

    if (doc.containsKey("pins")) {
      JsonObject pins = doc["pins"];
      if (pins.containsKey("led")) deviceConfig.pins.led = pins["led"];
      if (pins.containsKey("button")) deviceConfig.pins.button = pins["button"];
      if (pins.containsKey("scl")) deviceConfig.pins.scl = pins["scl"];
      if (pins.containsKey("sda")) deviceConfig.pins.sda = pins["sda"];
    }

    if (doc.containsKey("ssid")) deviceConfig.ssid = doc["ssid"].as<String>();
    if (doc.containsKey("password")) deviceConfig.password = doc["password"].as<String>();
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
  String getSSID() {
    return deviceConfig.ssid;
  }
  String getPassword() {
    return deviceConfig.password;
  }
  String getRemoteServer() {
    return deviceConfig.remote_server;
  }
  int getLedPin() {
    return deviceConfig.pins.led;
  }
  int getButtonPin() {
    return deviceConfig.pins.button;
  }
  int getSCLPin() {
    return deviceConfig.pins.scl;
  }
  int getSDAPin() {
    return deviceConfig.pins.sda;
  }
  int getBaudrate() {
    return deviceConfig.baudrate;
  }
};

#endif  // CONFIG_H
