import clsx from "clsx";
import { useRef } from "react";
import { Link } from "react-router";
import { LuPanelLeftClose } from "react-icons/lu";

import style from "./Sidebar.module.css";
import ThemeButton from "./components/ThemeButton/ThemeButton";

import { links, NavLink } from "@/data/links";
import { useAppContext } from "@/contexts/App";
import { useClickOutside, useMediaQuery } from "@pkgs/hooks";

export default function Sidebar() {
  const { pathname, openSidebar, setOpenSidebar } = useAppContext();

  const sidebarRef = useRef<HTMLHeadElement>(null);
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  function handleClickLink(link: NavLink) {
    if (pathname !== link.href && isSmallScreen) setOpenSidebar(false);
  }

  function handleClickOutside() {
    if (isSmallScreen && openSidebar) setOpenSidebar(false);
  }

  useClickOutside(handleClickOutside, sidebarRef, [isSmallScreen, openSidebar]);

  return (
    <header ref={sidebarRef} className={clsx(style.wrapper, { [style.active]: openSidebar })}>
      <header>
        <h1>Tempora</h1>
        {openSidebar && (
          <button type="button" onClick={() => setOpenSidebar(false)}>
            <LuPanelLeftClose size={22} title="收起侧边栏" />
          </button>
        )}
      </header>

      <nav className={style.menu}>
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className={clsx(style.link, { [style.active]: pathname === link.href })}
                onClick={() => handleClickLink(link)}
              >
                <div>
                  <link.Icon size={24} />
                </div>
                <span>{link.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <nav className={style.bottom}>
        <ThemeButton />
      </nav>
    </header>
  );
}
