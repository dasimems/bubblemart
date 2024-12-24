import { EmptyAnimation } from "@/assets/lotties";
import dynamic from "next/dynamic";
// import Lottie from "lottie-react";
import React from "react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export type ErrorContainerProp = {
  description?: string;
  className?: string;
};

const EmptyContainer: React.FC<ErrorContainerProp> = ({
  description,
  className
}) => {
  return (
    <div
      className={`${className} p-10 flex flex-col gap-6 items-center justify-center`}
    >
      <Lottie
        animationData={EmptyAnimation}
        autoPlay={true}
        loop={true}
        className="size-56"
      />
      <div className="flex flex-col items-center gap-2 text-center -mt-14">
        <p className="opacity-60">{description || "No data found!"}</p>
      </div>
    </div>
  );
};

export default EmptyContainer;
