import React from "react";
import SectionContainer from "../layouts/SectionContainer";
import Image from "next/image";
import { WrittenLogo } from "@/assets/images";
import { siteName } from "@/utils/variables";
import Link from "next/link";
import Button from "../Button";
import { Menu } from "lucide-react";

const Nav = () => {
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

          <button
            title="Open menu"
            aria-label="Open menu"
            className="inline-block md:hidden"
          >
            <Menu />
          </button>
        </div>
      </div>
    </SectionContainer>
  );
};

export default Nav;
