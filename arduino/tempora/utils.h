#ifndef UTILS_H
#define UTILS_H

class Utils {
private:
  static uint32_t simpleHash(const uint8_t* data, size_t len) {
    uint32_t h = 0x811C9DC5;
    const uint32_t PRIME = 16777619;
    for (size_t i = 0; i < len; ++i) {
      h ^= data[i];
      h *= PRIME;
      h += data[i];
    }
    return h;
  }

public:
  // Generate a random ID of specified length
  static String generateID(int length = 6) {
    randomSeed(analogRead(0));
    const char charset[] = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    String id = "";
    for (int i = 0; i < length; i++) {
      int index = random(0, sizeof(charset) - 1);
      id += charset[index];
    }
    return id;
  }

  // Compute hash and return hexadecimal string (uppercase, zero‑padded)
  static String hash(const String& input) {
    uint32_t h = simpleHash((const uint8_t*)input.c_str(), input.length());
    char buf[9];
    snprintf(buf, sizeof(buf), "%08X", h);
    return String(buf);
  }

  // Get the value of a cookie by name from a cookie string
  static String getCookieValue(String cookies, const String& name) {
    int start = cookies.indexOf(name + "=");
    if (start == -1) return "";
    start += name.length() + 1;
    int end = cookies.indexOf(";", start);
    if (end == -1) end = cookies.length();

    return cookies.substring(start, end);
  }
};

#endif  // UTILS_H
