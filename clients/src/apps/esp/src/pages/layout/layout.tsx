import { Outlet } from "react-router";

import style from "./Layout.module.css";
import Navbar from "./components/Navtab/Navtab";
import Sidebar from "./components/Sidebar/Sidebar";
import { AppContextProvider } from "@/contexts/App";

export default function Layout() {
  return (
    <AppContextProvider>
      <main className={style.wrapper}>
        <Sidebar />

        <div className={style.content}>
          <Navbar />
          <Outlet />
        </div>
      </main>
    </AppContextProvider>
  );
}
