import PageLayout from "@/components/layouts/PageLayout";
import About from "@/components/pages/home/About";
import Banner from "@/components/pages/home/Banner";
import Products from "@/components/pages/home/Products";

export default function Home() {
  return (
    <PageLayout>
      <Banner />
      <About />
      <Products />
    </PageLayout>
  );
}
