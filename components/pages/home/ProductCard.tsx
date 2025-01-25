import { postData, putData } from "@/api";
import { ProductImage } from "@/assets/images";
import Button from "@/components/Button";
import InputField from "@/components/general/InputField";
import useUser from "@/hooks/useUser";
import { ProductDetailsType } from "@/store/useProductStore";
import { constructErrorMessage } from "@/utils/functions";
import { siteName } from "@/utils/variables";
import { MinusIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDebouncedCallback } from "use-debounce";

const ProductCard: React.FC<
  ProductDetailsType & {
    isCart?: boolean;
    cartQuantity?: number;
    totalPrice?: AmountType;
  }
> = ({
  name,
  image,
  description,
  type,
  amount,
  id,
  quantity,
  isCart,
  cartQuantity,
  totalPrice
}) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { push } = useRouter();
  const { userToken, userDetails } = useUser();
  const [hasUpdatedPerfumeCount, setHasUpdatedPerfumeCount] = useState(false);
  const [productCount, setProductCount] = useState(1);
  const addProductToCart = useCallback(async () => {
    if (!userToken) {
      return push("/auth/login?redirect=/");
    }
    if (!id) {
      return;
    }
    if (!productCount) {
      return;
    }
    setIsAddingToCart(true);
    try {
      await postData("/cart", {
        productId: id,
        quantity: productCount
      });
      toast.success(`${name} added to cart!`);
    } catch (error) {
      toast.error(
        constructErrorMessage(
          error as ApiErrorResponseType,
          "Unknown error occurred whilst fetching order!"
        )
      );
    } finally {
      setIsAddingToCart(false);
    }
  }, [id, productCount, userToken, push, name]);

  const updateProduct = useCallback(
    async (quantity: number) => {
      if (!userToken) {
        return push("/auth/login?redirect=/");
      }
      if (!id) {
        return;
      }
      if (!quantity) {
        return;
      }
      setIsAddingToCart(true);
      try {
        await putData("/cart", {
          productId: id,
          quantity
        });
        toast.success(`${name} updated!`);
      } catch (error) {
        setProductCount(cartQuantity || 1);
        toast.error(
          constructErrorMessage(
            error as ApiErrorResponseType,
            "Unknown error occurred whilst fetching order!"
          )
        );
      } finally {
        setIsAddingToCart(false);
        setHasUpdatedPerfumeCount(false);
      }
    },
    [id, userToken, push, name]
  );

  const debouncedUpdateCart = useDebouncedCallback(
    // function
    (quantity: number) => {
      updateProduct(quantity);
    },
    1500
  );

  useEffect(() => {
    if (isCart) {
      setProductCount(cartQuantity || 1);
    }
  }, [cartQuantity, isCart]);

  useEffect(() => {
    if (isCart && productCount && hasUpdatedPerfumeCount) {
      debouncedUpdateCart(productCount);
    }
  }, [productCount, isCart, hasUpdatedPerfumeCount, debouncedUpdateCart]);

  return (
    <div className="flex flex-col sm:flex-row items-stretch rounded-3xl border shadow-md p-10 gap-10 bg-white border-slate-300">
      <div className=" w-full sm:w-1/3 md:w-3/6 h-[clamp(10rem,20vw,20rem)] shrink-0 bg-slate-200 rounded-2xl overflow-hidden relative">
        <Image
          alt={`${name}-${description}`}
          src={image}
          fill
          className="object-cover object-center"
        />
      </div>

      <div className="flex flex-col justify-between flex-1 gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-primary-800">
            {type === "gift" ? "Edible gifts" : ""}
          </p>
          <h1 className="font-bold text-[clamp(1rem,5vw,1.5rem)] text-primary">
            {name}
          </h1>
          {!isCart && (
            <h1 className="font-bold text-[clamp(1rem,5vw,1.5rem)]">
              {amount?.formatted?.withCurrency}
            </h1>
          )}
          {isCart && (
            <h1 className="font-bold text-[clamp(1rem,5vw,1.5rem)]">
              {totalPrice?.formatted?.withCurrency}
            </h1>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-primary-800">Description</p>
          <p>{description}</p>
        </div>

        {!isCart && (
          <div className="flex flex-col gap-2">
            <p className="text-primary-800">Quantity</p>
            <InputField
              className="self-start"
              value={productCount?.toString()}
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
              rightIconAction={() => {
                if (productCount === quantity) {
                  return toast(
                    "You can't add more than the available quantity"
                  );
                }
                setProductCount((prevState) =>
                  prevState >= quantity ? quantity : prevState + 1
                );
              }}
              leftIconAction={() =>
                setProductCount((prevState) =>
                  prevState > 1 ? prevState - 1 : 1
                )
              }
            />
            <Button
              loading={isAddingToCart}
              disabled={!userDetails}
              onClick={addProductToCart}
              buttonType="primary"
              className="text-white text-center !rounded-full"
            >
              Add to cart
            </Button>
          </div>
        )}
        {isCart && (
          <div className="flex flex-col gap-2">
            <p className="text-primary-800">Quantity</p>
            <InputField
              className="self-start"
              disabled={isAddingToCart}
              value={productCount?.toString()}
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
              rightIconAction={() => {
                if (isAddingToCart) {
                  return;
                }
                if (productCount === quantity) {
                  return toast(
                    "You can't add more than the available quantity"
                  );
                }
                setProductCount((prevState) =>
                  prevState >= quantity ? quantity : prevState + 1
                );

                if (isCart && productCount !== quantity) {
                  setHasUpdatedPerfumeCount(true);
                }
              }}
              leftIconAction={() => {
                if (isAddingToCart) {
                  return;
                }
                setProductCount((prevState) =>
                  prevState > 1 ? prevState - 1 : 1
                );
                if (isCart && productCount !== quantity) {
                  setHasUpdatedPerfumeCount(true);
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
