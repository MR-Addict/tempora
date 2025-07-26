import { useAppContext } from "@/contexts/App";

export default function Setup() {
  const { config } = useAppContext();

  return (
    <div className="w-full space-y-3">
      {config.data === null && <p>配置信息加载中...</p>}
      {config.data !== null && (
        <>
          <h1>当前配置信息:</h1>
          <pre className="w-full bg-gray-200 p-4 rounded-md">{JSON.stringify(config.data, null, 2)}</pre>
        </>
      )}
    </div>
  );
}
