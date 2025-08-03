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

  // Detect content type based on file extension
  static String getContentType(const String& filename) {
    String extension = "";
    int lastDot = filename.lastIndexOf('.');
    if (lastDot > 0) {
      extension = filename.substring(lastDot);
      extension.toLowerCase();
    }

    // Text files
    if (extension == ".html" || extension == ".htm") return "text/html";
    if (extension == ".css") return "text/css";
    if (extension == ".js") return "application/javascript";
    if (extension == ".json") return "application/json";
    if (extension == ".xml") return "application/xml";
    if (extension == ".txt") return "text/plain";
    if (extension == ".csv") return "text/csv";

    // Images
    if (extension == ".png") return "image/png";
    if (extension == ".jpg" || extension == ".jpeg") return "image/jpeg";
    if (extension == ".gif") return "image/gif";
    if (extension == ".svg") return "image/svg+xml";
    if (extension == ".ico") return "image/x-icon";
    if (extension == ".webp") return "image/webp";
    if (extension == ".bmp") return "image/bmp";

    // Fonts
    if (extension == ".woff") return "font/woff";
    if (extension == ".woff2") return "font/woff2";
    if (extension == ".ttf") return "font/ttf";
    if (extension == ".otf") return "font/otf";
    if (extension == ".eot") return "application/vnd.ms-fontobject";

    // Audio/Video
    if (extension == ".mp3") return "audio/mpeg";
    if (extension == ".wav") return "audio/wav";
    if (extension == ".ogg") return "audio/ogg";
    if (extension == ".mp4") return "video/mp4";
    if (extension == ".webm") return "video/webm";
    if (extension == ".avi") return "video/x-msvideo";

    // Archives
    if (extension == ".zip") return "application/zip";
    if (extension == ".gz") return "application/gzip";
    if (extension == ".tar") return "application/x-tar";
    if (extension == ".rar") return "application/vnd.rar";

    // Documents
    if (extension == ".pdf") return "application/pdf";
    if (extension == ".doc") return "application/msword";
    if (extension == ".docx") return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    if (extension == ".xls") return "application/vnd.ms-excel";
    if (extension == ".xlsx") return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    // Default fallback
    return "application/octet-stream";
  }
};

#endif  // UTILS_H
