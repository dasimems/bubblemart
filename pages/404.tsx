import { Error404Image } from "@/assets/images";
import SectionContainer from "@/components/layouts/SectionContainer";
import { siteName } from "@/utils/variables";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Error404Page = () => {
  return (
    <SectionContainer
      className="bg-gradient-to-b from-primary-900 to-white to-75% w-screen h-screen  gap-32 flex flex-col"
      contentContainerClassName="flex flex-col gap-20 items-center justify-center w-full h-full"
    >
      <div className="flex flex-col gap-2 text-center">
        <Image
          src={Error404Image}
          alt={`${siteName} error 404`}
          className="size-[20vw] min-w-32 max-w-[96]"
        />
        <h1 className="font-extrabold text-3xl md:text-5xl">Error 404</h1>
        <p>
          Go back to{" "}
          <Link href="/" className="underline">
            Homepage
          </Link>
        </p>
      </div>
    </SectionContainer>
  );
};

Error404Page.hideFooter = true;
Error404Page.title = "Page not found!";
export default Error404Page;
