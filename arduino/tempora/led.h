#ifndef LED_H
#define LED_H

class LedService {
private:
  int ledPin;
  bool ready;
  Ticker ledTicker;

  void blinkCallback() {
    if (ready) digitalWrite(ledPin, !digitalRead(ledPin));
  }

public:
  LedService() {}

  // Initialize the LED service with a pin
  bool begin(int pin) {
    if (pin == -1) {
      ready = false;
      return false;
    }

    ready = true;
    ledPin = pin;
    pinMode(ledPin, OUTPUT);
    digitalWrite(ledPin, LOW);

    return true;
  }

  // Set LED to always on
  void on() {
    if (ready) digitalWrite(ledPin, HIGH);
  }

  // Set LED to always off
  void off() {
    if (ready) digitalWrite(ledPin, LOW);
  }

  // Set LED to blink mode with specified interval (in milliseconds)
  void blink(uint64_t interval = 300) {
    if (ready) ledTicker.attach_ms(interval, std::bind(&LedService::blinkCallback, this));
  }
};

#endif  // LED_H
