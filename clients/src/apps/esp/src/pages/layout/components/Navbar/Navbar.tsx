import { LuPanelLeftClose, LuPanelRightClose } from "react-icons/lu";

import style from "./Navbar.module.css";
import { useAppContext } from "@/contexts/App";

export default function Navbar() {
  const { openSidebar, setOpenSidebar } = useAppContext();

  function handleClick() {
    setOpenSidebar((prev) => !prev);
  }

  return (
    <header className={style.wrapper}>
      <button type="button" onClick={handleClick} title="展开/收起侧边栏" className={style.btn}>
        {openSidebar ? <LuPanelLeftClose size={22} /> : <LuPanelRightClose size={22} />}
      </button>
    </header>
  );
}
