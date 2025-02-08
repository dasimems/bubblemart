import React, { useCallback, useEffect, useRef, useState } from "react";
import SectionContainer from "../layouts/SectionContainer";
import Image from "next/image";
import { AvatarImage, WrittenLogo } from "@/assets/images";
import { siteName } from "@/utils/variables";
import Link from "next/link";
import Button from "../Button";
import {
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  ShoppingBag,
  X
} from "lucide-react";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/router";

const Nav = () => {
  const { userToken, userDetails, logoutUser } = useUser();
  const [menuHeight, setMenuHeight] = useState(0);
  const menuContentRef = useRef<HTMLUListElement>(null);
  const [isAccountMenuOpened, setIsAccountMenuOpened] = useState(false);
  const router = useRouter();

  const openMobileMenu = useCallback((shouldClose?: boolean) => {
    if (shouldClose) {
      setMenuHeight(0);
      return;
    }
    const menuElement = menuContentRef?.current;
    if (!menuElement) {
      return;
    }
    const menuHeight = menuElement?.clientHeight;

    if (!menuHeight) {
      return;
    }

    setMenuHeight((prevState) => (prevState > 0 ? 0 : menuHeight));
  }, []);

  useEffect(() => {
    setIsAccountMenuOpened(false);
    openMobileMenu(true);
  }, [router, openMobileMenu]);

  return (
    <>
      <SectionContainer
        className="sticky top-0 z-10 bg-[#CFE9E7] md:bg-transparent"
        contentContainerClassName=""
      >
        <div className="relative w-full">
          <div className="py-3 bg-[#CFE9E7] md:border border-[#BAC9CC] relative md:absolute md:left-0 md:top-10 w-full md:px-10 rounded-[1rem] justify-between flex items-center">
            <Link href="/">
              <Image
                src={WrittenLogo}
                alt={`${siteName}`}
                className="w-20 md:w-36 object-contain"
              />
            </Link>

            <ul className=" items-center gap-10 hidden md:flex">
              <li>
                <Link href="/products/gifts" className="text-primary">
                  Gift Mailing
                </Link>
              </li>
              <li>
                <Link href="/products/logs" className="text-primary">
                  Logs
                </Link>
              </li>
              <li>
                <Link
                  target="_blank"
                  href="https://www.instagram.com/bubblemart_sma"
                  className="text-primary"
                >
                  Reviews
                </Link>
              </li>
              <li>
                <Link
                  target="_blank"
                  href="https://wa.me/message/7L2YDAYBOR4JI1"
                  className="text-primary"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
            {!userToken && (
              <ul className="items-center gap-10 hidden md:flex">
                <li>
                  <Link href="/auth/login" className="text-primary">
                    Login
                  </Link>
                </li>
                <li>
                  <Button
                    onClick={() => {
                      router.push("/auth/register");
                    }}
                    className="!bg-primary text-white !py-2 !rounded-md"
                  >
                    Sign Up
                  </Button>
                </li>
              </ul>
            )}
            {userToken && (
              <div className="items-center gap-2 hidden md:flex relative">
                <div className="size-14 rounded-full bg-slate-100 overflow-hidden relative">
                  <Image
                    src={AvatarImage}
                    alt="Avatar image"
                    fill
                    className="object-center object-cover"
                  />
                </div>
                <div className="flex flex-col items-start gap-1">
                  {userDetails && (
                    <>
                      <h2 className="font-medium">{userDetails?.name}</h2>
                      <h2 className="opacity-60">{userDetails?.email}</h2>
                    </>
                  )}
                  {!userDetails && (
                    <>
                      <div className="w-[5rem] animate-pulse h-3 bg-slate-300 rounded-md" />
                      <div className="w-[3rem] animate-pulse h-3 bg-slate-300 rounded-md" />
                    </>
                  )}
                </div>
                <button
                  title="Open menu"
                  aria-label="Open menu"
                  className={`inline-block ml-5 ${
                    !userDetails ? "cursor-not-allowed" : "cursor-pointer "
                  }`}
                  onClick={() => {
                    if (!userDetails) {
                      return;
                    }
                    setIsAccountMenuOpened((prevState) => !prevState);
                  }}
                >
                  <Menu size={30} />
                </button>
                {isAccountMenuOpened && (
                  <ul className="absolute top-[4.5rem] right-0 items-start flex flex-col gap-1 w-full min-w-[15rem] bg-slate-100 shadow-lg rounded-md">
                    {userDetails?.role === "ADMIN" && (
                      <li className="w-full bg-secondary-950">
                        <Link
                          className="w-full flex items-center gap-2 hover:bg-primary-900 hover:pl-7 duration-300 py-3 px-5"
                          href="/account"
                        >
                          <span className="opacity-70">
                            <LayoutDashboard size={14} />
                          </span>
                          <span>Dashboard</span>
                        </Link>
                      </li>
                    )}
                    <li className="w-full">
                      <Link
                        className="w-full flex items-center gap-2 hover:bg-primary-900 hover:pl-7 duration-300 py-3 px-5"
                        href="/cart"
                      >
                        <span className="opacity-70">
                          <ShoppingBag size={14} />
                        </span>
                        <span>Cart</span>
                      </Link>
                    </li>
                    <li className="w-full">
                      <Link
                        className="w-full flex items-center gap-1 hover:bg-primary-900 hover:pl-7 duration-300 py-3 px-5"
                        href="/orders"
                      >
                        <span className="opacity-70">
                          <FileText size={14} />
                        </span>
                        <span>Orders</span>
                      </Link>
                    </li>
                    <li className="w-full">
                      <button
                        onClick={() => {
                          logoutUser();
                        }}
                        className="w-full flex items-center gap-1 text-red-400 hover:bg-primary-900 hover:pl-7 duration-300 py-3 px-5"
                      >
                        <span className="opacity-70">
                          <LogOut size={14} />
                        </span>
                        <span>Logout</span>
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            )}

            <button
              onClick={() => {
                openMobileMenu();
              }}
              title="Open menu"
              aria-label="Open menu"
              className={`inline-block md:hidden ${
                menuHeight > 0 && userToken && "size-10"
              } ${
                userToken &&
                menuHeight <= 0 &&
                "size-10 rounded-full bg-slate-100 overflow-hidden relative"
              }`}
            >
              {menuHeight <= 0 && (
                <>
                  {!userToken && <Menu />}
                  {userToken && (
                    <Image
                      src={AvatarImage}
                      alt="Avatar image"
                      fill
                      className="object-center object-cover"
                    />
                  )}
                </>
              )}
              {menuHeight > 0 && <X />}
            </button>
          </div>
        </div>
        <div
          className="absolute top-full w-full left-0 overflow-hidden duration-300 transition-all"
          style={{
            height: `${menuHeight}px`
          }}
        >
          <ul
            ref={menuContentRef}
            className="p-5 bg-[#CFE9E7] flex flex-col gap-10 max-h-[calc(100vh-64px)] overflow-auto shadow-xl"
          >
            <li>
              <Link href="/products/gifts" className="text-primary">
                Gift mailing
              </Link>
            </li>
            <li>
              <Link href="/products/logs" className="text-primary">
                Logs
              </Link>
            </li>
            {userToken && (
              <li>
                <Link href="/products/logs" className="text-primary">
                  Cart
                </Link>
              </li>
            )}
            {userToken && (
              <li>
                <Link href="/products/logs" className="text-primary">
                  Orders
                </Link>
              </li>
            )}
            <li>
              <Link href="/reviews" className="text-primary">
                Reviews
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-primary">
                Contact Us
              </Link>
            </li>
            {userToken && (
              <li>
                <button
                  onClick={() => {
                    logoutUser();
                  }}
                  className="w-full flex items-center gap-1 text-red-400 hover:bg-primary-900"
                >
                  <span>Logout</span>
                </button>
              </li>
            )}
            {!userToken && (
              <li>
                <Link href="/auth/login" className="text-primary">
                  Login
                </Link>
              </li>
            )}
            {!userToken && (
              <li>
                <Link href="/auth/register" className="text-primary">
                  Sign up
                </Link>
              </li>
            )}
          </ul>
        </div>
      </SectionContainer>
    </>
  );
};

export default Nav;
