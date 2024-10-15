import React from "react";

const AuthLayout: React.FC<{
  children?: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div className="h-screen bg-gradient-to-b from-primary-900 to-white to-90% min-h-screen gap-32 flex flex-col pt-10 md:pt-40"></div>
      <div className={className}>{children}</div>
    </div>
  );
};

export default AuthLayout;
