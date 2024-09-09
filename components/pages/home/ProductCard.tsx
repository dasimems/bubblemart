import { ProductImage } from "@/assets/images";
import Button from "@/components/Button";
import InputField from "@/components/general/InputField";
import { siteName } from "@/utils/variables";
import { MinusIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

const ProductCard = () => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch rounded-3xl border shadow-md p-10 gap-10">
      <div className=" w-full sm:w-1/3 md:w-3/6 h-[clamp(10rem,20vw,20rem)] shrink-0 bg-slate-200 rounded-2xl overflow-hidden relative">
        <Image
          alt={`Product ${siteName}`}
          src={ProductImage}
          fill
          className="object-cover object-center"
        />
      </div>

      <div className="flex flex-col justify-between flex-1 gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-primary-800">Edible gifts</p>
          <h1 className="font-bold text-[clamp(1rem,5vw,1.5rem)] text-primary">
            Pizza & Drink
          </h1>
          <h1 className="font-bold text-[clamp(1rem,5vw,1.5rem)]">₦10,600</h1>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-primary-800">Description</p>
          <p>Tasty pizza and cocacola drink</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-primary-800">Quantity</p>
          <InputField
            className="self-start"
            value={"1"}
            inputClassName="bg-primary-950 border-none text-center w-36"
            placeholder=" "
            rightButtonClassName="right-1 absolute -translate-y-1/2 top-1/2 h-[85%] px-1 border-slate-600 border rounded-md items-center inline-flex"
            leftButtonClassName="left-1 absolute -translate-y-1/2 top-1/2 h-[85%] px-1 border-slate-600 border rounded-md items-center inline-flex"
            rightIcon={
              <span className=" inline-flex">
                <PlusIcon />
              </span>
            }
            leftIcon={
              <span className=" inline-flex">
                <MinusIcon />
              </span>
            }
          />
          <Button
            buttonType="primary"
            className="!bg-primary text-white text-center !rounded-full"
          >
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
