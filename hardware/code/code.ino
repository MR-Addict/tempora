#include <WiFi.h>
#include <Wire.h>
#include <Ticker.h>
#include <ArduinoJson.h>
#include <Preferences.h>

#include "led.h"
#include "config.h"

DeviceConfig config;
LedService ledService;

void disconnectedCallback(WiFiEvent_t event, WiFiEventInfo_t info) {
  WiFi.begin(config.getSSID(), config.getPassword());
  Serial.println("WiFi connection lost. Try to reconnect...");
}

void STAMode() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(config.getSSID(), config.getPassword());
  Serial.printf("Connecting to %s", config.getSSID());
  WiFi.onEvent(disconnectedCallback, WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_DISCONNECTED);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print('.');
  }
  Serial.printf("\nLocal IP: %s\n", WiFi.localIP().toString().c_str());
}

void APMode() {
  IPAddress localip(192, 168, 1, 1);
  IPAddress gateway(192, 168, 1, 1);
  IPAddress subnet(255, 255, 255, 0);

  if (!WiFi.softAPConfig(localip, gateway, subnet)) {
    Serial.println("Failed to configure SoftAP IP");
    return;
  }

  WiFi.mode(WIFI_AP);
  WiFi.softAP(config.getName());
  Serial.printf("AP IP: %s\n", WiFi.softAPIP().toString().c_str());
  ledService.blink();
}

void app() {
  // Initialize serial
  Serial.begin(115200);

  // Initialize config
  if (config.begin()) {
    Serial.begin(config.getBaudrate());
    Serial.print("Current config JSON:");
    Serial.println(config.toJson());
  } else {
    Serial.println("Unable to start the config session.");
    return;
  }

  // Initialize pins
  WiFi.hostname(config.getName());
  ledService.begin(config.getLedPin());
  if (config.getButtonPin() != -1) pinMode(config.getButtonPin(), INPUT_PULLUP);
  if (config.getSCLPin() != -1 && config.getSDAPin() != -1) {
    Wire.begin(config.getSCLPin(), config.getSDAPin());
  }

  // Initialize WiFi
  bool isAPMode = config.getSSID().isEmpty() || config.getPassword().isEmpty();
  if (!isAPMode && config.getButtonPin() != -1 && digitalRead(config.getButtonPin()) == LOW) {
    delay(1000);
    if (digitalRead(config.getButtonPin()) == LOW) {
      unsigned long startTime = millis();
      while (digitalRead(config.getButtonPin()) == LOW && millis() - startTime <= 5000) {
        delay(100);
      }
      if (millis() - startTime > 5000) isAPMode = true;
    }
  }

  // Start WiFi in the appropriate mode
  if (isAPMode) {
    Serial.println("Starting in AP mode...");
    APMode();
  } else {
    Serial.println("Starting in STA mode...");
    STAMode();
  }
}

void setup() {
  app();
}

void loop() {
}
