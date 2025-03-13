import { deleteData, postData, putData } from "@/api";
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
import { MinusIcon, PlusIcon, Trash2 } from "lucide-react";
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
    cartId?: string;
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
  totalPrice,
  cartId
}) => {
  const [deletingCartItem, setDeletingCartItem] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { updateCart, removeCart } = useCart();
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
        return toast.error("No product id found!");
      }
      if (!quantity) {
        return toast.error("You can't add 0 quantity!");
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

  const deleteCartItem = useCallback(async () => {
    if (deletingCartItem) {
      return;
    }
    if (!cartId) {
      return toast.error("No cart id found!");
    }
    setDeletingCartItem(true);
    try {
      await deleteData(`/cart/${cartId}`);
      removeCart(cartId);
    } catch (error) {
      toast.error(
        constructErrorMessage(
          error as ApiErrorResponseType,
          "Unknown error occurred whilst deleting cart item!"
        )
      );
    } finally {
      setDeletingCartItem(false);
    }
  }, [cartId, deletingCartItem, removeCart]);

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
    if (isCart && productCount && hasUpdatedPerfumeCount && !deletingCartItem) {
      debouncedUpdateCart(productCount);
    }
  }, [
    productCount,
    isCart,
    hasUpdatedPerfumeCount,
    debouncedUpdateCart,
    deletingCartItem
  ]);

  return (
    <div
      className={`flex flex-col sm:flex-row items-stretch rounded-xl md:rounded-3xl border shadow-md p-2 md:p-10 gap-4 md:gap-10 bg-white border-slate-300 ${
        deletingCartItem && "opacity-30"
      }`}
    >
      <div className=" w-full sm:w-1/3 md:w-3/6 h-[clamp(10rem,18vw,18rem)] shrink-0 bg-slate-200 rounded-2xl overflow-hidden relative">
        <Image
          alt={`${name}-${description}`}
          src={image}
          fill
          className="object-cover object-center"
        />
        {isCart && (
          <button
            title={`Delete ${name} from cart`}
            aria-label={`Delete ${name} from cart`}
            disabled={deletingCartItem}
            onClick={deleteCartItem}
            className="size-7 bg-red-100 text-red-600 rounded-md z-10 inline-flex items-center justify-center absolute top-3 left-3"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      <div className="flex flex-col md:justify-between flex-1 gap-2 md:gap-6">
        <div className="flex flex-col gap-1">
          {/* <p className="text-primary-800">
            {type === "gift" ? "Edible gifts" : ""}
          </p> */}
          <h1 className="font-bold text-[clamp(0.7rem,1.5vw,1.5rem)] text-primary">
            {name}
          </h1>
          {!isCart && (
            <h1 className="font-bold text-[clamp(0.7rem,1.5vw,1.5rem)]">
              {amount?.formatted?.withCurrency}
            </h1>
          )}
          {isCart && (
            <h1 className="font-bold text-[clamp(0.6rem,1.5vw,1.5rem)]">
              {totalPrice?.formatted?.withCurrency}
            </h1>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-primary-800 text-[0.7rem] md:text-base">
            Description
          </p>
          <p className="text-[0.6rem] md:text-base">{description}</p>
        </div>

        {!!quantity && (
          <>
            {!isCart && (
              <>
                <div className={`flex flex-col gap-2`}>
                  <p className="text-primary-800 text-[0.7rem] md:text-base">
                    Quantity{" "}
                    <span className="font-bold text-primary-100 md:text-sm">
                      ({quantity})
                    </span>
                  </p>
                  <InputField
                    className="self-start w-full md:w-auto"
                    value={productCount?.toString()}
                    inputClassName="bg-primary-950 border-none text-center w-full md:w-36 !py-1 md:!py-3 text-sm md:text-base"
                    placeholder=" "
                    onChange={(e) => {
                      let { value } = e.target as HTMLInputElement;
                      if (!value) {
                        value = "0";
                      }
                      if (isNaN(Number(value))) {
                        return;
                      }
                      const inputtedQuantity = parseInt(value);
                      if (inputtedQuantity > quantity) {
                        return toast(
                          "You can't add more than the available quantity",
                          {
                            toastId: toastIds.addToCartError
                          }
                        );
                      }
                      setProductCount(inputtedQuantity);
                    }}
                    rightButtonClassName="right-1 absolute -translate-y-1/2 top-1/2 h-[85%] px-1 border-slate-600 border rounded-md items-center inline-flex"
                    leftButtonClassName="left-1 absolute -translate-y-1/2 top-1/2 h-[85%] px-1 border-slate-600 border rounded-md items-center inline-flex"
                    rightIcon={
                      <span className=" inline-flex">
                        <PlusIcon className="size-3 md:size-5" />
                      </span>
                    }
                    leftIcon={
                      <span className=" inline-flex">
                        <MinusIcon className="size-3 md:size-5" />
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
                    className="text-white !py-1 md:!py-3 text-center text-[0.5rem] md:text-base !rounded-full"
                  >
                    Add to cart
                  </Button>
                </div>
              </>
            )}
            {isCart && (
              <div className="flex flex-col gap-2">
                <p className="text-primary-800">Quantity</p>
                <div
                  className={`relative ${
                    isAddingToCart && "opacity-40 cursor-not-allowed"
                  } w-full`}
                >
                  <InputField
                    className="self-start"
                    disabled={isAddingToCart || deletingCartItem}
                    value={productCount?.toString()}
                    inputClassName="bg-primary-950 border-none text-center w-36"
                    placeholder=" "
                    onChange={(e) => {
                      let { value } = e.target as HTMLInputElement;
                      if (!value) {
                        value = "0";
                      }
                      if (isNaN(Number(value))) {
                        return;
                      }
                      const inputtedQuantity = parseInt(value);
                      if (inputtedQuantity > quantity) {
                        return toast(
                          "You can't add more than the available quantity",
                          {
                            toastId: toastIds.addToCartError
                          }
                        );
                      }
                      setHasUpdatedPerfumeCount(true);
                      setProductCount(inputtedQuantity);
                    }}
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
                      if (isAddingToCart || deletingCartItem) {
                        return;
                      }
                      if (productCount >= quantity) {
                        return toast(
                          "You can't add more than the available quantity"
                        );
                      }
                      setProductCount((prevState) =>
                        prevState >= quantity ? quantity : prevState + 1
                      );

                      setHasUpdatedPerfumeCount(true);
                    }}
                    leftIconAction={() => {
                      if (isAddingToCart || deletingCartItem) {
                        return;
                      }
                      setProductCount((prevState) => {
                        const newCount = prevState - 1;
                        if (newCount && productCount <= quantity) {
                          setHasUpdatedPerfumeCount(true);
                        }
                        return newCount || 1;
                      });
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
          </>
        )}
        {!quantity && (
          <div className="py-2 bg-red-100 px-5 self-start rounded-md">
            <p className="text-red-700 text-xs md:text-sm font-medium">
              OUT OF STOCK
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
