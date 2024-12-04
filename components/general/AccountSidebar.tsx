import { WrittenLogo } from "@/assets/images";
import { siteName } from "@/utils/variables";
import Image from "next/image";
import React from "react";

const AccountSidebar = () => {
  return (
    <div className="w-72 hidden md:flex flex-col h-screen px-4">
      <div className="h-16 flex items-center justify-center">
        <Image
          src={WrittenLogo}
          alt={`${siteName}-logo`}
          className="w-full h-4 object-contain object-center"
        />
      </div>
    </div>
  );
};

export default AccountSidebar;
