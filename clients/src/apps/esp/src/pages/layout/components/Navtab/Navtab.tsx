import style from "./Navtab.module.css";
import Navigation from "./components/Navigation/Navigation";
import ThemeButton from "./components/ThemeButton/ThemeButton";
import ToggleButton from "./components/ToggleButton/ToggleButton";

export default function Navbar() {
  return (
    <header className={style.wrapper}>
      <ToggleButton />
      <Navigation />
      <ThemeButton className="ml-auto" />
    </header>
  );
}
