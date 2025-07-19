struct ConfigStruct {
  String id;
  String name;
  int baudrate;
  struct {
    int led;
    int reset;
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
  ConfigStruct device;

  DeviceConfig() {}

  bool begin() {
    if (load()) {
      if (device.id == "") reset();
      return true;
    } else return false;
  }

  bool reset() {
    device.id = IDGenerator::generate();
    device.name = "Tempora-" + device.id;
    device.baudrate = 115200;
    device.pins.led = 2;
    device.pins.reset = 0;
    device.pins.scl = -1;
    device.pins.sda = -1;
    device.ssid = "";
    device.password = "";
    device.remote_server = "";

    return save();
  }

  bool load() {
    if (!preferences.begin(CONFIG_NAMESPACE, true)) return false;

    device.id = preferences.getString("id", "");
    device.name = preferences.getString("name", "");
    device.baudrate = preferences.getInt("baudrate", 0);
    device.pins.led = preferences.getInt("pin_led", -1);
    device.pins.reset = preferences.getInt("pin_reset", -1);
    device.pins.scl = preferences.getInt("pin_scl", -1);
    device.pins.sda = preferences.getInt("pin_sda", -1);
    device.ssid = preferences.getString("ssid", "");
    device.password = preferences.getString("password", "");
    device.remote_server = preferences.getString("remote_server", "");
    preferences.end();

    return true;
  }

  bool save() {
    if (!preferences.begin(CONFIG_NAMESPACE, false)) return false;

    preferences.putString("id", device.id);
    preferences.putString("name", device.name);
    preferences.putInt("baudrate", device.baudrate);
    preferences.putInt("pin_led", device.pins.led);
    preferences.putInt("pin_reset", device.pins.reset);
    preferences.putInt("pin_scl", device.pins.scl);
    preferences.putInt("pin_sda", device.pins.sda);
    preferences.putString("ssid", device.ssid);
    preferences.putString("password", device.password);
    preferences.putString("remote_server", device.remote_server);
    preferences.end();

    return true;
  }

  // Serialize config to JSON string
  String toJson() {
    DynamicJsonDocument doc(1024);

    doc["id"] = device.id;
    doc["name"] = device.name;
    doc["baudrate"] = device.baudrate;

    JsonObject pins = doc.createNestedObject("pins");
    pins["led"] = device.pins.led;
    pins["reset"] = device.pins.reset;
    pins["scl"] = device.pins.scl;
    pins["sda"] = device.pins.sda;

    doc["ssid"] = device.ssid;
    doc["password"] = device.password;
    doc["remote_server"] = device.remote_server;

    String jsonString;
    serializeJson(doc, jsonString);
    return jsonString;
  }

  // Parse JSON string and update config
  bool fromJson(const String& jsonString) {
    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, jsonString);

    if (error) return false;

    // Store current ID to prevent changes
    String currentId = device.id;

    // ID cannot be changed after first initialization
    // Only allow setting ID if it's currently empty
    if (doc.containsKey("id") && device.id.isEmpty()) {
      device.id = doc["id"].as<String>();
    }

    if (doc.containsKey("name")) device.name = doc["name"].as<String>();

    if (doc.containsKey("pins")) {
      JsonObject pins = doc["pins"];
      if (pins.containsKey("led")) device.pins.led = pins["led"];
      if (pins.containsKey("reset")) device.pins.reset = pins["reset"];
      if (pins.containsKey("scl")) device.pins.scl = pins["scl"];
      if (pins.containsKey("sda")) device.pins.sda = pins["sda"];
    }

    if (doc.containsKey("ssid")) device.ssid = doc["ssid"].as<String>();
    if (doc.containsKey("password")) device.password = doc["password"].as<String>();
    if (doc.containsKey("remote_server")) device.remote_server = doc["remote_server"].as<String>();
    if (doc.containsKey("baudrate")) device.baudrate = doc["baudrate"];

    return true;
  }

  // Getters for easy access
  String getId() {
    return device.id;
  }
  String getName() {
    return device.name;
  }
  String getSSID() {
    return device.ssid;
  }
  String getPassword() {
    return device.password;
  }
  String getRemoteServer() {
    return device.remote_server;
  }
  int getLedPin() {
    return device.pins.led;
  }
  int getResetPin() {
    return device.pins.reset;
  }
  int getSCLPin() {
    return device.pins.scl;
  }
  int getSDAPin() {
    return device.pins.sda;
  }
  int getBaudrate() {
    return device.baudrate;
  }
};
