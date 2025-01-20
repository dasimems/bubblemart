import { BannerImageOne, BannerImageTwo } from "@/assets/images";
import Button from "@/components/Button";
import SectionContainer from "@/components/layouts/SectionContainer";
import { siteName } from "@/utils/variables";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { FaRegArrowAltCircleRight } from "react-icons/fa";

const Banner = () => {
  const { push } = useRouter();
  return (
    <SectionContainer contentContainerClassName="flex flex-col gap-6">
      <h1 className="text-center text-primary font-bold font-satoshi max-w-[800px] self-center mx-auto text-[clamp(1.5rem,5vw,3.5rem)]">
        Shop Social Media logs and Mail gifts abroad ASAP
      </h1>
      <p className="mx-auto text-[clamp(1rem,5vw,1.3rem)] text-center max-w-[500px]">
        Nigeria leading social media agency , putting smiles on peoples face
        abroad through gifting mail.
      </p>
      <div className="flex items-center gap-10 justify-center">
        <Button
          onClick={() => {
            push("/products/logs");
          }}
          buttonType="secondary"
          className="flex items-center gap-4 !rounded-full text-white"
        >
          <span>Get Logs</span>
          <span>
            <FaRegArrowAltCircleRight />
          </span>
        </Button>
        <Button
          onClick={() => {
            push("/products/gifts");
          }}
          className="flex items-center gap-4 !rounded-full !bg-[#5BC4BE] text-primary"
        >
          <span>Send Gifts</span>
          <span>
            <FaRegArrowAltCircleRight />
          </span>
        </Button>
      </div>
      <div className="flex items-end mt-10">
        <div className="w-[55%] rounded-t-2xl rounded-tl-[clamp(1.5rem,6vw,6rem)] h-[clamp(13rem,30vw,30rem)] bg-slate-200 relative overflow-hidden">
          <Image
            alt={`Purchase logs ${siteName}`}
            src={BannerImageOne}
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="w-[55%] rounded-t-2xl rounded-tr-[clamp(1.5rem,5vw,5rem)] h-[clamp(11rem,25vw,25rem)] bg-slate-200 -ml-[5%] relative overflow-hidden">
          <Image
            alt={`Send gifts ${siteName}`}
            src={BannerImageTwo}
            fill
            className="object-cover object-center"
          />
        </div>
      </div>
    </SectionContainer>
  );
};

export default Banner;
