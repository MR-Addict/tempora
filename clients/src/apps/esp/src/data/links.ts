import type { IconType } from "react-icons";
import { HiOutlineCpuChip } from "react-icons/hi2";
import { LiaTemperatureHighSolid } from "react-icons/lia";

export interface NavLink {
  href: string;
  name: string;
  Icon: IconType;
}

export const links: NavLink[] = [
  {
    href: "/",
    name: "概览",
    Icon: LiaTemperatureHighSolid
  },
  {
    href: "/status",
    name: "设备状态",
    Icon: HiOutlineCpuChip
  }
];
