import "@/styles/satoshi.css";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import aos from "aos";
import "aos/dist/aos.css";
import NextNProgress from "nextjs-progressbar";
import { ToastContainer } from "react-toastify";
import SEO from "@/components/general/SEO";
import Footer from "@/components/general/Footer";
import Nav from "@/components/general/Nav";
export type AppEngineProps = AppProps & {
  Component: {
    title?: string;
    description?: string;
    image?: string;
    imageDescription?: string;
    locale?: string;
  };
};

export default function App({ Component, pageProps }: AppEngineProps) {
  useEffect(() => {
    aos.init({
      once: true,
      easing: "ease-in-out",
      duration: 1000
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
      <Nav />
      <Component {...pageProps} />
      <Footer />
      <ToastContainer
        autoClose={3000}
        newestOnTop
        position="top-center"
        limit={1}
      />
    </>
  );
}
