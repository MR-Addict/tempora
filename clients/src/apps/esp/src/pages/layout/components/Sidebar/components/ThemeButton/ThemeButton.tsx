import { createElement } from "react";
import { MdComputer } from "react-icons/md";
import { AiOutlineMoon, AiOutlineSun } from "react-icons/ai";

import type { ThemeType } from "@pkgs/hooks";
import { useAppContext } from "@/contexts/App";

import style from "./ThemeButton.module.css";
import { type SelectOption, Select } from "@pkgs/components";

const themes = {
  light: {
    name: "亮色模式",
    Icon: AiOutlineSun
  },
  dark: {
    name: "暗色模式",
    Icon: AiOutlineMoon
  },
  system: {
    name: "跟随系统",
    Icon: MdComputer
  }
};

function ThemeValue({ theme }: { theme: ThemeType }) {
  const { name, Icon } = themes[theme];
  return (
    <span className={style.value}>
      {createElement(Icon, { size: 20 })}
      <span>{name}</span>
    </span>
  );
}

function ThemeLabel() {
  const { theme } = useAppContext();

  return <div className={style.label}>{createElement(themes[theme].Icon, { size: 20 })}</div>;
}

export default function ThemeButton({ className }: { className?: string }) {
  const { theme, setTheme } = useAppContext();

  function handleThemeChange(value: ThemeType) {
    setTheme(value);
  }

  const themeOptions: SelectOption<ThemeType>[] = [
    {
      label: <ThemeValue theme="light" />,
      value: "light",
      active: theme === "light"
    },
    {
      label: <ThemeValue theme="dark" />,
      value: "dark",
      active: theme === "dark"
    },
    {
      label: <ThemeValue theme="system" />,
      value: "system",
      active: theme === "system"
    }
  ];

  return (
    <Select
      align="top-left"
      arrowIcon={false}
      className={className}
      options={themeOptions}
      onChange={handleThemeChange}
      label={<ThemeLabel />}
    />
  );
}
