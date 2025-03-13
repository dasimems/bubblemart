import React from "react";

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-gradient-to-b from-primary-900 to-white to-40% min-h-screen gap-10 md:gap-32 flex flex-col pt-10 md:pt-40 relative">
      {children}
    </div>
  );
};

export default PageLayout;
