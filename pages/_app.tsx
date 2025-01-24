import "react-toastify/dist/ReactToastify.css";
import "@/styles/satoshi.css";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import aos from "aos";
import "aos/dist/aos.css";
import NextNProgress from "nextjs-progressbar";
import SEO from "@/components/general/SEO";
import Footer from "@/components/general/Footer";
import Nav from "@/components/general/Nav";
import { useRouter } from "next/router";
import AccountLayout from "@/components/layouts/AccountLayout";
import ApplicationWrapper from "@/components/layouts/ApplicationWrapper";
import CustomToast from "@/components/ui/customToast/CustomToast";
export type AppEngineProps = AppProps & {
  Component: {
    title?: string;
    description?: string;
    image?: string;
    imageDescription?: string;
    locale?: string;
    hideFooter?: boolean;
    hideNav?: boolean;
  };
};

export default function App({ Component, pageProps }: AppEngineProps) {
  const { pathname } = useRouter();
  const isAuthRoute = pathname.includes("/auth/");
  const isAccountRoute = pathname.includes("/account");
  useEffect(() => {
    aos.init({
      once: true,
      easing: "ease-in-out",
      duration: 1000,
    });
  }, []);
  return (
    <>
      <NextNProgress color="#0A434F" height={3.5} />
      <SEO
        title={Component?.title}
        description={Component?.description}
        image={Component?.image}
        imageDescription={Component?.imageDescription}
        locale={Component?.locale}
      />
      <ApplicationWrapper>
        {!isAccountRoute && (
          <>
            {!Component.hideNav && !isAuthRoute && <Nav />}
            <Component {...pageProps} />
            {!Component.hideFooter && !isAuthRoute && <Footer />}
          </>
        )}
        {isAccountRoute && (
          <AccountLayout>
            <Component {...pageProps} />
          </AccountLayout>
        )}
      </ApplicationWrapper>

      <CustomToast />
    </>
  );
}
