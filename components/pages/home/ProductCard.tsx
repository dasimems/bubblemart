import { postData, putData } from "@/api";
import { ProductImage } from "@/assets/images";
import Button from "@/components/Button";
import InputField from "@/components/general/InputField";
import Spinner from "@/components/general/Spinner";
import useCart from "@/hooks/useCart";
import useUser from "@/hooks/useUser";
import { CartDetailsType } from "@/store/useCartStore";
import { ProductDetailsType } from "@/store/useProductStore";
import { constructErrorMessage } from "@/utils/functions";
import { toastIds } from "@/utils/variables";
import { MinusIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDebouncedCallback } from "use-debounce";

type UpdateCartBodyType = {
  productId: string;
  quantity: number;
};

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
  const { updateCart } = useCart();
  const { push, asPath } = useRouter();
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
      const { data } = await postData<
        UpdateCartBodyType,
        ApiCallResponseType<CartDetailsType>
      >("/cart", {
        productId: id,
        quantity: productCount
      });
      toast.success(`${name} added to cart!`);
      updateCart(data?.data);
    } catch (error) {
      toast.error(
        constructErrorMessage(
          error as ApiErrorResponseType,
          "Unknown error occurred whilst adding to cart!"
        )
      );
    } finally {
      setIsAddingToCart(false);
    }
  }, [id, productCount, userToken, push, name, updateCart]);

  const updateProduct = useCallback(
    async (quantity: number) => {
      if (!userToken) {
        return push(`/auth/login?redirect=${asPath}`);
      }
      if (!id) {
        return;
      }
      if (!quantity) {
        return;
      }
      setIsAddingToCart(true);
      try {
        const { data } = await putData<
          UpdateCartBodyType,
          ApiCallResponseType<CartDetailsType>
        >("/cart", {
          productId: id,
          quantity
        });

        updateCart(data?.data);
        toast.success(`${name} updated!`);
      } catch (error) {
        setProductCount(cartQuantity || 1);
        toast.error(
          constructErrorMessage(
            error as ApiErrorResponseType,
            "Unknown error occurred whilst updating cart!"
          )
        );
      } finally {
        setIsAddingToCart(false);
        setHasUpdatedPerfumeCount(false);
      }
    },
    [id, userToken, push, name, asPath, cartQuantity, updateCart]
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
                    "You can't add more than the available quantity",
                    {
                      toastId: toastIds.addToCartError
                    }
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
              disabled={!!userToken && !userDetails}
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
            <div className="relative w-auto w-full">
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
              {isAddingToCart && (
                <div className="absolute flex top-0 left-0 h-full w-full items-center justify-center">
                  <Spinner className="!size-4 !border-2" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
