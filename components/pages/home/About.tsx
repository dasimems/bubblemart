import { AboutImage } from "@/assets/images";
import Button from "@/components/Button";
import SectionContainer from "@/components/layouts/SectionContainer";
import { siteName } from "@/utils/variables";
import Image from "next/image";
import React from "react";

const About = () => {
  return (
    <SectionContainer contentContainerClassName="grid grid-cols-1 md:grid-cols-2 items-start md:items-center gap-10 md:gap-20">
      <div className="flex flex-col gap-4 items-start">
        <h1 className="font-bold text-[clamp(1.2rem,5vw,2rem)]">
          Putting Smiles on <br /> Faces through Gifting
          <br /> or offering SMA services.
        </h1>
        <p>
          At bubblemart we offer the best social media and internet premium
          tools to help individuals figure out internet more easily, while
          offering sweet moment chances to make friends and lovers smile by
          gifting them abroad.
        </p>

        <Button buttonType="primary" className="!rounded-full">
          Get started
        </Button>
      </div>
      <div className="flex flex-col h-[clamp(13rem,30vw,30rem)] bg-slate-200 rounded-tl-[clamp(1.5rem,6vw,6rem)] relative overflow-hidden">
        <Image
          alt={`About ${siteName}`}
          src={AboutImage}
          fill
          className="object-cover object-center"
        />
      </div>
    </SectionContainer>
  );
};

export default About;
