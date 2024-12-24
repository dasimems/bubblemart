import React from "react";

const ProductCardLoader = () => {
  return (
    <div className="bg-slate-100 p-10 rounded-xl flex items-center gap-6">
      <div className=" w-full sm:w-1/3 md:w-3/6 h-[clamp(10rem,20vw,20rem)] shrink-0 bg-slate-300 rounded-2xl overflow-hidden animate-pulse" />
      <div className="flex-1 flex-col gap-4 flex">
        <div className="w-[3rem] animate-pulse h-3 bg-slate-300 rounded-md" />
        <div className="w-[6rem] animate-pulse h-3 bg-slate-300 rounded-md" />
        <div className="w-[4rem] animate-pulse h-3 bg-slate-300 rounded-md" />
        <div className="w-full animate-pulse h-3 bg-slate-300 rounded-md" />
      </div>
    </div>
  );
};

export default ProductCardLoader;
