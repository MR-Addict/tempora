#include "config.h"

DeviceConfig config;

void connectionLostCallback(WiFiEvent_t event, WiFiEventInfo_t info) {
  WiFi.begin(config.getSSID(), config.getPassword());
  Serial.println("WiFi connection lost. Try to reconnect...");
}

void init() {
  // Initialize config
  if (config.begin()) {
    Serial.begin(config.getBaudrate());
    Serial.print("Current config JSON:");
    Serial.println(config.toJson());
  } else {
    Serial.begin(115200);
    Serial.println("Unable to start the config session.");
    return;
  }

  // Initialize pins
  pinMode(config.getLedPin(), OUTPUT);
  pinMode(config.getResetPin(), INPUT_PULLUP);

  // init wifi
  WiFi.hostname(config.getName());
  WiFi.begin(config.getSSID(), config.getPassword());
  WiFi.onEvent(connectionLostCallback, WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_DISCONNECTED);
  Serial.printf("Connecting to %s", config.getSSID());
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print('.');
  }
  Serial.printf("\nLocal IP: %s\n", WiFi.localIP().toString().c_str());
}
