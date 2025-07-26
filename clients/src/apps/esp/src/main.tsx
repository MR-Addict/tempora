import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router";

import "./main.css";
import "@pkgs/components/style.css";

import Home from "@/pages/home/home";
import NotFound from "./pages/404/404";
import Setup from "@/pages/setup/setup";
import Layout from "@/pages/layout/layout";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="setup" element={<Setup />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>
);
