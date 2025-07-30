import { HiOutlineCpuChip } from "react-icons/hi2";

import style from "./status.module.css";
import { ESPStatus } from "@/types/esp";
import { useAppContext } from "@/contexts/App";

function Content({ status }: { status: ESPStatus }) {
  return (
    <div className={style.content}>
      <header>
        <h1>ESP传感器状态</h1>
        <div>
          <HiOutlineCpuChip size={26} />
        </div>
      </header>

      <div className={style.container}>
        <div className={style.group}>
          <header className={style.header}>
            <h1>ESP硬件状态</h1>
            <p>ESP相关的硬件是否正常连接</p>
          </header>

          <div className={style.items}>
            <div className={style.item}>
              <h2>温度传感器连接状态</h2>
              <p>{status.sensor_connected ? "已连接" : "未连接"}</p>
            </div>
            <div className={style.item}>
              <h2>LED连接状态</h2>
              <p>{status.led_connected ? "已连接" : "未连接"}</p>
            </div>
            <div className={style.item}>
              <h2>按钮连接状态</h2>
              <p>{status.button_connected ? "已连接" : "未连接"}</p>
            </div>
          </div>
        </div>

        <div className={style.group}>
          <header className={style.header}>
            <h1>ESP网络状态</h1>
            <p>ESP当前的网络状态</p>
          </header>

          <div className={style.items}>
            <div className={style.item}>
              <h2>WiFi连接状态</h2>
              <p>{status.wifi_connected ? "已连接" : "未连接"}</p>
            </div>
            <div className={style.item}>
              <h2>WiFi模式</h2>
              <p>{status.sta ? "STA模式" : "AP模式"}</p>
            </div>
            <div className={style.item}>
              <h2>SSID</h2>
              <p>{status.ssid}</p>
            </div>
            <div className={style.item}>
              <h2>IP地址</h2>
              <p>{status.ip}</p>
            </div>
            <div className={style.item}>
              <h2>设备名称</h2>
              <p>{status.hostname}</p>
            </div>
            <div className={style.item}>
              <h2>MAC地址</h2>
              <p>{status.mac}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Status() {
  const { status } = useAppContext();

  return (
    <div className={style.wrapper}>
      {!status.data && <p>配置信息加载中...</p>}
      {status.data && (status.data.success ? <Content status={status.data.data} /> : <p>{status.data.message}</p>)}
    </div>
  );
}
