import url from "@/lib/utils/url";
import { Link } from "react-router";

export default function Home() {
  return (
    <div className="p-4 h-[200vh]">
      <h1 className="text-4xl font-bold text-gray-700">Home Page</h1>
      <p className="mt-2 text-lg text-gray-700">Welcome to the home page of our application!</p>
      <Link to="/setup" className="mt-4 inline-block text-blue-500 hover:underline">
        Go to Setup Page
      </Link>
      <Link to="/non-existent" className="mt-4 inline-block text-red-500 hover:underline">
        Go to Non-Existent Page
      </Link>
      <Link to="/404" className="mt-4 inline-block text-red-500 hover:underline">
        Go to 404 Page
      </Link>
      <p>{url()}</p>
    </div>
  );
}
