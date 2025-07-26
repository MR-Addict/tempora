import { useAppContext } from "@/contexts/App";

export default function Home() {
  const { sensor } = useAppContext();

  return (
    <div className="w-full space-y-3">
      {sensor.data === null && <p>传感器数据加载中...</p>}
      {sensor.data !== null && (
        <>
          <h1>当前传感器数据:</h1>
          <pre className="w-full bg-gray-200 p-4 rounded-md">{JSON.stringify(sensor.data, null, 2)}</pre>
        </>
      )}
    </div>
  );
}
