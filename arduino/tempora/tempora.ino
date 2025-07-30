#include <WiFi.h>
#include <Wire.h>

#include <Ticker.h>
#include <ArduinoJson.h>
#include <Preferences.h>

#include <SPIFFS.h>
#include <ESPAsyncWebServer.h>

#include "led.h"
#include "utils.h"
#include "sht30.h"
#include "config.h"

SHT30 sht30;
DeviceConfig config;
LedService ledService;

Ticker restartTicker;
static AsyncWebServer server(80);

/**
  Web Server handlers
*/
static AsyncMiddlewareFunction authMiddleware([](AsyncWebServerRequest* request, ArMiddlewareNext next) {
  // Skip authentication if no token is set
  if (config.getToken().isEmpty()) next();
  else {
    bool isAuthenticated = false;

    if (!request->getHeader("Cookie")) isAuthenticated = false;
    else {
      String cookies = request->getHeader("Cookie")->value();
      String cookieValue = Utils::getCookieValue(cookies, "token");
      isAuthenticated = (cookieValue == config.getToken());
    }

    if (isAuthenticated) next();
    else request->send(401, "text/plain", "未授权访问，请先登录");
  }
});

void loginRequest(AsyncWebServerRequest* request) {
  if (config.getToken().isEmpty()) request->send(500, "text/plain", "ESP32还没有配置token信息");
  else if (request->hasParam("password", true)) {
    String password = request->getParam("password", true)->value();
    String token = Utils::hash(password);
    if (token == config.getToken()) {
      AsyncWebServerResponse* response = request->beginResponse(200, "text/plain", "登录成功");
      response->addHeader("Set-Cookie", "token=" + token + "; Path=/; HttpOnly; Max-Age=2592000");
      request->send(response);
    } else request->send(401, "text/plain", "密码错误");
  } else request->send(400, "text/plain", "缺少密码参数");
}

void logoutRequest(AsyncWebServerRequest* request) {
  AsyncWebServerResponse* response = request->beginResponse(200, "text/plain", "登出成功");
  response->addHeader("Set-Cookie", "token=; Path=/; HttpOnly; Max-Age=0");
  request->send(response);
}

void handleNotFound(AsyncWebServerRequest* request) {
  String url = request->url();
  if (request->method() == HTTP_OPTIONS) request->send(200);
  else if (request->method() == HTTP_GET) {
    if (SPIFFS.exists(url)) {
      if (url.endsWith(".js") || url.endsWith(".css")) {
        String contentType = url.endsWith(".js") ? "application/javascript" : "text/css";
        AsyncWebServerResponse* response = request->beginResponse(SPIFFS, url, contentType);
        response->addHeader(AsyncWebHeader("Cache-Control", "max-age=259200, public"));
        request->send(response);
      } else request->send(SPIFFS, url);
    } else {
      url += "index.html";
      if (SPIFFS.exists(url)) request->send(SPIFFS, url, "text/html");

      else request->send(404, "text/plain", "404 Not Found");
    }
  } else request->send(404, "text/plain", "404 Not Found");
}

void healthCheckRequest(AsyncWebServerRequest* request) {
  request->send(200, "text/plain", "OK");
}

void statusGETRequest(AsyncWebServerRequest* request) {
  StaticJsonDocument<512> doc;

  doc["led_connected"] = config.getPinsLed() != -1;
  doc["button_connected"] = config.getPinsButton() != -1;
  doc["wifi_connected"] = WiFi.status() == WL_CONNECTED;
  doc["sensor_connected"] = sht30.available();

  doc["name"] = config.getName();
  doc["sta"] = WiFi.getMode() == WIFI_STA;
  doc["rssi"] = WiFi.RSSI();
  doc["ssid"] = WiFi.SSID();
  doc["ip"] = WiFi.localIP().toString();
  doc["mac"] = WiFi.macAddress();
  doc["hostname"] = WiFi.getHostname();

  String response;
  serializeJson(doc, response);
  request->send(200, "application/json", response);
}

void configGETRequest(AsyncWebServerRequest* request) {
  request->send(200, "application/json", config.toJson());
}

void configPUTRequest(AsyncWebServerRequest* request) {
  if (request->hasParam("body", true)) {
    String formData = request->getParam("body", true)->value();
    if (config.fromJson(formData)) request->send(200, "application/json", config.toJson());
    else request->send(500, "text/plain", "配置信息格式错误");
  } else request->send(400, "text/plain", "请求体缺少body参数");
}

void sensorGETRequest(AsyncWebServerRequest* request) {
  SHT30Data data = sht30.readData();
  request->send(200, "application/json", data.toJson());
}

void restartRequest(AsyncWebServerRequest* request) {
  restartTicker.attach_ms(2000, []() {
    ESP.restart();
  });
  ledService.blink();
  request->send(200, "text/plain", "重启请求已发送，ESP32将在2秒后重启");
}

void resetRequest(AsyncWebServerRequest* request) {
  config.reset();
  request->send(200, "application/json", config.toJson());
}

/**
  WiFi handlers
*/
void disconnectedCallback(WiFiEvent_t event, WiFiEventInfo_t info) {
  if (config.getWiFiPassword().isEmpty()) WiFi.begin(config.getWiFiSSID());
  else WiFi.begin(config.getWiFiSSID(), config.getWiFiPassword());
  Serial.println("WiFi connection lost. Try to reconnect...");
}

void STAMode() {
  WiFi.mode(WIFI_STA);
  if (config.getWiFiPassword().isEmpty()) WiFi.begin(config.getWiFiSSID());
  else WiFi.begin(config.getWiFiSSID(), config.getWiFiPassword());
  Serial.printf("Connecting to %s", config.getWiFiSSID());
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
  WiFi.softAP("tempora-" + config.getId());
  Serial.printf("AP IP: %s\n", WiFi.softAPIP().toString().c_str());
  ledService.blink();
}

void setup() {
  // Initialize config
  if (config.begin()) {
    Serial.begin(config.getBaudrate());
    Serial.print("Current config JSON:");
    Serial.println(config.toJson());
  } else {
    Serial.println("Unable to start the config session.");
    return;
  }

  // init SPIFFS
  if (!SPIFFS.begin(true)) {
    Serial.println("Failed to mount SPIFFS");
    return;
  }

  // Initialize pins
  WiFi.hostname("tempora-" + config.getId());
  ledService.begin(config.getPinsLed());
  sht30.begin(config.getPinsSDA(), config.getPinsSCL());
  if (config.getPinsButton() != -1) pinMode(config.getPinsButton(), INPUT_PULLUP);

  // Initialize WiFi
  bool isAPMode = config.getWiFiSSID().isEmpty();
  if (!isAPMode && config.getPinsButton() != -1 && digitalRead(config.getPinsButton()) == LOW) {
    delay(1000);
    if (digitalRead(config.getPinsButton()) == LOW) {
      unsigned long duration = 3000;
      unsigned long startTime = millis();
      while (digitalRead(config.getPinsButton()) == LOW && millis() - startTime <= duration) {
        delay(100);
      }
      if (millis() - startTime > duration) isAPMode = true;
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

  // Initialize web server
  Serial.println("Starting web server...");

  // Set up default headers
  DefaultHeaders::Instance().addHeader("Server", "ESP32");

  // Set up API endpoints
  server.on("/api/health", HTTP_GET, healthCheckRequest);
  server.on("/api/status", HTTP_GET, statusGETRequest);
  server.on("/api/sensor", HTTP_GET, sensorGETRequest);

  server.on("/api/login", HTTP_POST, loginRequest);
  server.on("/api/logout", HTTP_GET, logoutRequest);

  server.on("/api/config", HTTP_GET, configGETRequest).addMiddleware(&authMiddleware);
  server.on("/api/config", HTTP_PUT, configPUTRequest).addMiddleware(&authMiddleware);
  server.on("/api/restart", HTTP_POST, restartRequest).addMiddleware(&authMiddleware);
  server.on("/api/reset", HTTP_POST, resetRequest).addMiddleware(&authMiddleware);

  // Handle root and not found requests
  server.onNotFound(handleNotFound);
  server.begin();
}

void loop() {}
