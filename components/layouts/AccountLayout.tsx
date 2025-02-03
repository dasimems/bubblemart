import React, { useCallback, useEffect } from "react";
import AccountSidebar from "../general/AccountSidebar";
import AccountNav from "../general/AccountNav";
import useUser from "@/hooks/useUser";
import Spinner from "../general/Spinner";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { getSavedToken } from "@/localservices";
import { toastIds } from "@/utils/variables";

export type AccountLayoutProp = {
  children: React.ReactNode;
};

const AccountLayout: React.FC<AccountLayoutProp> = ({ children }) => {
  const { userDetails, userToken } = useUser();
  const { push, asPath } = useRouter();

  const redirectToLogin = useCallback(() => {
    push(`/auth/login?redirect=${asPath}`);
    toast("Please login!", {
      toastId: toastIds.loginRedirect
    });
  }, [push, asPath]);

  const redirectToHome = useCallback(() => {
    push("/");
  }, [push]);

  useEffect(() => {
    if (window) {
      const savedToken = getSavedToken();
      if (!userToken && !savedToken) {
        redirectToLogin();
      }
    }
  }, [userToken, redirectToLogin]);

  useEffect(() => {
    if (userDetails && userDetails?.role !== "ADMIN") {
      redirectToHome();
    }
  }, [userDetails, redirectToHome]);

  if (!userDetails || (userDetails && userDetails?.role !== "ADMIN")) {
    return (
      <div className="w-screen h-screen items-center justify-center flex">
        <Spinner />
      </div>
    );
  }

  return (
    <section className="flex items-start">
      <AccountSidebar />
      <div className="flex-1 flex flex-col gap-4 bg-slate-100 min-h-screen">
        <AccountNav />
        {children}
      </div>
    </section>
  );
};

export default AccountLayout;
