import { LuPanelLeftClose, LuPanelRightClose } from "react-icons/lu";

import style from "./ToggleButton.module.css";
import { useAppContext } from "@/contexts/App";

export default function ToggleButton() {
  const { openSidebar, setOpenSidebar } = useAppContext();

  function handleClick() {
    setOpenSidebar((prev) => !prev);
  }

  return (
    <button type="button" onClick={handleClick} title="展开/收起侧边栏" className={style.wrapper}>
      {openSidebar ? <LuPanelLeftClose size={22} /> : <LuPanelRightClose size={22} />}
    </button>
  );
}
