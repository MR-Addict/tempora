import { useMemo } from "react";
import { Link } from "react-router";
import { TbError404 } from "react-icons/tb";

import { useAppContext } from "@/contexts/App";
import { links, type NavLink } from "@/data/links";

const unknownPage: NavLink = {
  href: "/",
  name: "未知页面",
  Icon: TbError404
};

export default function Navigation() {
  const { pathname } = useAppContext();

  const link = useMemo(() => {
    const found = links.find((link) => link.href === pathname);
    return found ?? unknownPage;
  }, [pathname]);

  return (
    <Link to={link.href} className="text-lg">
      {link.name}
    </Link>
  );
}
