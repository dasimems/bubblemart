import React, { useCallback, useEffect } from "react";
import useUser from "./useUser";
import Spinner from "@/components/general/Spinner";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { getSavedToken } from "@/localservices";
import { toastIds } from "@/utils/variables";

const protectRoute = <P extends object>(Component: React.ComponentType<P>) => {
  const ProtectedPage = (props: P) => {
    const { userToken } = useUser();
    const { push, asPath } = useRouter();

    const redirectToLogin = useCallback(() => {
      push(`/auth/login?redirect=${asPath}`);
      toast("Please login!", {
        toastId: toastIds.loginRedirect
      });
    }, [push, asPath]);

    useEffect(() => {
      if (window) {
        const savedToken = getSavedToken();
        if (!userToken && !savedToken) {
          redirectToLogin();
        }
      }
    }, [redirectToLogin, userToken]);

    if (!userToken) {
      return (
        <div className="w-screen h-screen items-center justify-center flex">
          <Spinner />
        </div>
      );
    }

    return <Component {...props} />;
  };
  return ProtectedPage;
};

export default protectRoute;
