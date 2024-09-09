import About from "@/components/pages/home/About";
import Banner from "@/components/pages/home/Banner";
import Products from "@/components/pages/home/Products";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-primary-950 to-white to-30% min-h-screen gap-32 flex flex-col pt-10 md:pt-40">
      <Banner />
      <About />
      <Products />
    </div>
  );
}
