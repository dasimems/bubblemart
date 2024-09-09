import SectionContainer from "@/components/layouts/SectionContainer";
import React from "react";
import ProductCard from "./ProductCard";

const Products = () => {
  return (
    <SectionContainer contentContainerClassName="gap-10 flex flex-col">
      <h1 className="max-w-[300px] font-bold text-[clamp(1.2rem,5vw,2rem)] self-center text-center">
        Explore what <br /> we have for you.
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
        {new Array(4).fill(0).map((_, index) => (
          <ProductCard key={index} />
        ))}
      </div>
    </SectionContainer>
  );
};

export default Products;
