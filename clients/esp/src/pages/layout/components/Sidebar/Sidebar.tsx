import clsx from "clsx";
import { Link } from "react-router";
import { LuPanelLeftClose } from "react-icons/lu";

import style from "./Sidebar.module.css";
import { links } from "@/data/links";
import { useAppContext } from "@/contexts/App";

export default function Sidebar() {
  const { pathname, openSidebar, setOpenSidebar } = useAppContext();

  return (
    <header className={clsx(style.wrapper, { [style.active]: openSidebar })}>
      <header>
        <h1>Tempora</h1>
        {openSidebar && (
          <button type="button" onClick={() => setOpenSidebar(false)}>
            <LuPanelLeftClose size={22} title="收起侧边栏" />
          </button>
        )}
      </header>

      <nav className={style.nav}>
        <ul>
          {links.map((tab) => (
            <li key={tab.href}>
              <Link to={tab.href} className={clsx(style.link, { [style.active]: pathname === tab.href })}>
                <div>
                  <tab.Icon size={24} />
                </div>
                <span>{tab.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
