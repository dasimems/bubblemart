import React from "react";

const OrderCardLoader = () => {
  return (
    <div className="bg-slate-100 py-3 px-5 rounded-md flex gap-4 items-center">
      <div className=" bg-slate-300  animate-pulse rounded-full size-10" />
      <div className="flex flex-col gap-2 w-full">
        <div className="w-[6rem] animate-pulse h-3 bg-slate-300 rounded-md" />
        <div className="w-[10rem] animate-pulse h-3 bg-slate-300 rounded-md" />
      </div>
    </div>
  );
};

export default OrderCardLoader;
