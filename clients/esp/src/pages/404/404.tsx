import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="p-4 flex flex-col items-center gap-1">
        <h1 className="text-3xl font-bold">404 - Not Found</h1>
        <p>
          <span>抱歉，您访问的页面不存在</span>
          <span> | </span>
          <Link to="/" className="text-blue-500 hover:underline">
            返回首页
          </Link>
        </p>
      </div>
    </div>
  );
}
