import { LoginSvgImage } from "@/assets/svgs";
import useUser from "@/hooks/useUser";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";

const AuthLayout: React.FC<{
  children?: React.ReactNode;
  className?: string;
  SVGImage: any;
}> = ({ children, className, SVGImage }) => {
  const { push, pathname } = useRouter();
  const splittedPathname = pathname?.split("/");

  const { userToken } = useUser();

  const handleRedirect = useCallback(() => {
    push("/");
  }, [push]);

  useEffect(() => {
    if (userToken && splittedPathname[1] === "auth") {
      handleRedirect();
    }
  }, [userToken, splittedPathname, handleRedirect]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div className="h-screen bg-gradient-to-b from-primary-900 to-white to-90% min-h-screen gap-32 flex flex-col items-center justify-center pt-10 md:pt-40">
        <Image
          alt="Auth"
          src={SVGImage || LoginSvgImage}
          className="w-[60%] object-contain"
        />
      </div>
      <div className={className}>{children}</div>
    </div>
  );
};

export default AuthLayout;
