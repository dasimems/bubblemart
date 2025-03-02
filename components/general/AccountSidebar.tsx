import { WrittenLogo } from "@/assets/images";
import useUser from "@/hooks/useUser";
import { siteName } from "@/utils/variables";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useRef, useState } from "react";
import { FiUsers } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { LiaAngleDownSolid, LiaDollarSignSolid } from "react-icons/lia";
import {
  LuGitCompare,
  LuLayoutPanelLeft,
  LuMessageSquare
} from "react-icons/lu";

const LinkContainer: React.FC<{
  path: string;
  label: string;
  icon: React.ReactNode;
}> = ({ path, label, icon }) => {
  const { pathname } = useRouter();
  const isActive = pathname === path;
  return (
    <Link
      href={path || ""}
      className={`inline-flex items-center gap-2 px-3 py-4 rounded-md transition-all duration-300 ${
        isActive ? "bg-primary text-white" : "opacity-60 hover:pl-5"
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

type DropdownLinkType = {
  path: string;
  label: string;
};

const LinkDropDownContainer: React.FC<{
  links: DropdownLinkType[];
  label: string;
  icon: React.ReactNode;
}> = ({ links = [], label, icon }) => {
  const [height, setHeight] = useState(0);
  const { pathname } = useRouter();
  const isActive = !!links.find((link) => link.path === pathname);
  const isOpened = height > 0;
  const ref = useRef<HTMLDivElement>(null);
  const handleClick = useCallback((opened: boolean) => {
    const element = ref?.current;

    if (!element) {
      return;
    }

    setHeight(opened ? 0 : element?.clientHeight);
  }, []);
  return (
    <div className="flex flex-col">
      <button
        onClick={() => {
          handleClick(isOpened);
        }}
        className={`inline-flex items-center gap-2 px-3 py-4 rounded-md transition-all duration-300 ${
          isActive ? "bg-primary text-white" : "opacity-60 hover:pl-5"
        } ${isOpened && "bg-slate-100"}`}
      >
        <span className="inline-flex items-center gap-2 flex-1">
          <span>{icon}</span>
          <span>{label}</span>
        </span>

        <span
          className={`${
            isOpened ? "-rotate-180" : "rotate-0"
          } transition-all duration-300`}
        >
          <LiaAngleDownSolid />
        </span>
      </button>
      <div
        style={{
          height: `${height}px`
        }}
        className="transition-all duration-300 w-full overflow-hidden"
      >
        <div ref={ref} className="flex flex-col">
          {links.map(({ path, label }, index) => {
            const isActiveLink = pathname === path;
            return (
              <Link
                key={path}
                href={path || ""}
                className={`inline-flex items-center gap-2 px-6 py-4 transition-all duration-300 ${
                  index > 0 && "border-t border-slate-300"
                } ${isActiveLink ? "text-primary" : "opacity-60 hover:pl-9"}`}
              >
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const AccountSidebar = () => {
  const { logoutUser } = useUser();
  return (
    <div className="w-72 hidden md:flex flex-col h-screen sticky top-0 overflow-auto gap-10">
      <div className="h-16 flex items-center justify-center  px-6">
        <Link href={"/"} className="flex items-center gap-2">
          <Image
            src={WrittenLogo}
            alt={`${siteName}-logo`}
            className="w-full h-4 object-contain object-center"
          />
        </Link>
      </div>
      <div className="flex-1 flex flex-col gap-2 px-3">
        <LinkContainer
          label="Dashboard"
          path={"/account"}
          icon={<LuLayoutPanelLeft />}
        />
        <LinkContainer
          label="Payment"
          path={"/account/payment"}
          icon={<LiaDollarSignSolid />}
        />
        <LinkContainer
          label="Orders"
          path={"/account/order"}
          icon={<LuGitCompare />}
        />
        <LinkDropDownContainer
          label="Products"
          links={[
            {
              path: "/account/products?type=gift",
              label: "Gift mail"
            },
            {
              path: "/account/products?type=log",
              label: "Fitsocial"
            }
          ]}
          icon={<HiOutlineShoppingBag />}
        />
        <LinkContainer
          label="Customers"
          path={"/account/users"}
          icon={<FiUsers />}
        />
        <LinkContainer
          label="Messages"
          path={"/account/messages"}
          icon={<LuMessageSquare />}
        />
      </div>
      <div className="pt-20 pb-6 border-t px-6">
        <button
          onClick={() => {
            logoutUser();
          }}
          className="inline-flex items-center gap-2 hover:text-red-500"
        >
          <span>
            <LogOut />
          </span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AccountSidebar;
