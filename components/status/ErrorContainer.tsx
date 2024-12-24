import { ErrorAnimation } from "@/assets/lotties";
import dynamic from "next/dynamic";
// import Lottie from "lottie-react";
import React from "react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export type ErrorContainerProp = {
  error?: string;
  className?: string;
  retryFunction?: () => void;
};

const ErrorContainer: React.FC<ErrorContainerProp> = ({
  error,
  className,
  retryFunction
}) => {
  return (
    <div
      className={`${className} p-10 flex flex-col gap-6 items-center justify-center`}
    >
      <Lottie
        animationData={ErrorAnimation}
        autoPlay={true}
        loop={true}
        className="size-12"
      />
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="opacity-60">{error || "Unknown error occured!"}</p>
        {retryFunction && (
          <button
            onClick={retryFunction}
            title="Retry action"
            aria-label="retry action"
            className="text-primary underline"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorContainer;
