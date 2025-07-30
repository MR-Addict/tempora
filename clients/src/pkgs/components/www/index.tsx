import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { useTheme } from "@pkgs/hooks";

import { Select } from "../src/Select/Select";

function ThemeButton() {
  const [theme, setTheme] = useTheme("light");

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="ml-auto bg-blue-600 text-white rounded-md px-3 py-2 duration-300 hover:bg-blue-700"
    >
      Switch ({theme})
    </button>
  );
}

function App() {
  return (
    <section className="app">
      <header className="header">
        <ThemeButton />
      </header>

      <div className="components">
        <Select label="Food" options={[{ label: "Apple", value: "apple" }]} />
      </div>
    </section>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
