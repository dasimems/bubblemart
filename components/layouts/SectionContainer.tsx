import React, { forwardRef } from "react";

const SectionContainer = forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode;
    isInnerContent?: boolean;
    className?: string;
    contentContainerClassName?: string;
  }
>(({ children, isInnerContent, className, contentContainerClassName }, ref) => {
  return (
    <div ref={ref} className={`${className}`}>
      <div
        className={`${contentContainerClassName} ${
          isInnerContent
            ? ""
            : "px-5 sm:px-10 md:px-[5rem] max-w-[1550px] w-full mx-auto"
        } relative`}
      >
        {children}
      </div>
    </div>
  );
});

SectionContainer.displayName = "SectionContainer";

export default SectionContainer;
