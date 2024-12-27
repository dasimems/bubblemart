import React, { useEffect, useState } from "react";
import SectionContainer from "../layouts/SectionContainer";
import Image from "next/image";
import { AvatarImage, WrittenLogo } from "@/assets/images";
import { siteName } from "@/utils/variables";
import Link from "next/link";
import Button from "../Button";
import { FileText, LogOut, Menu, ShoppingBag } from "lucide-react";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/router";

const Nav = () => {
  const { userToken, userDetails } = useUser();
  const [isAccountMenuOpened, setIsAccountMenuOpened] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsAccountMenuOpened(false);
  }, [router]);

  return (
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
              <Link href="/reviews" className="text-primary">
                Reviews
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-primary">
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
                <Button className="!bg-primary text-white !py-2 !rounded-md">
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
                    <button className="w-full flex items-center gap-1 text-red-400 hover:bg-primary-900 hover:pl-7 duration-300 py-3 px-5">
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
            title="Open menu"
            aria-label="Open menu"
            className={`inline-block md:hidden ${
              userToken &&
              "size-14 rounded-full bg-slate-100 overflow-hidden relative"
            }`}
          >
            {!userToken && <Menu />}
            {userToken && (
              <Image
                src={AvatarImage}
                alt="Avatar image"
                fill
                className="object-center object-cover"
              />
            )}
          </button>
        </div>
      </div>
    </SectionContainer>
  );
};

export default Nav;
