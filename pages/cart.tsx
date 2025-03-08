import { deleteData, postData } from "@/api";
import Button from "@/components/Button";
import InputField from "@/components/general/InputField";
import ProductCardLoader from "@/components/general/ProductCardLoader";
import Spinner from "@/components/general/Spinner";
import TextArea from "@/components/general/TextArea";
import PageLayout from "@/components/layouts/PageLayout";
import SectionContainer from "@/components/layouts/SectionContainer";
import ProductCard from "@/components/pages/home/ProductCard";
import EmptyContainer from "@/components/status/EmptyContainer";
import ErrorContainer from "@/components/status/ErrorContainer";
import protectRoute from "@/hooks/protectRoute";
import useCart from "@/hooks/useCart";
import useUser from "@/hooks/useUser";
import Autocomplete from "react-google-autocomplete";
import { constructErrorMessage } from "@/utils/functions";
import { phoneNumberRegExp } from "@/utils/regex";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaAngleLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import Label from "@/components/general/Label";
import { CartBodyType } from "@/store/useCartStore";
import useOrder from "@/hooks/useOrder";
import { OrderDetailsType, PaymentDetailsType } from "@/store/useOrderStore";

const defaultValues: CartBodyType = {
  senderName: "",
  receiverName: "",
  receiverAddress: "",
  receiverPhoneNumber: "",
  shortNote: "",
  longitude: 0,
  latitude: 0
};

const Cart = () => {
  const { back, push } = useRouter();
  const { getCart, carts, cartFetchingError, doCartNeedAddress, clearCart } =
    useCart();
  const { userToken } = useUser();
  const { updateOrder } = useOrder();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [clearingCart, setClearingCart] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setError,
    setValue,
    watch,
    reset,
    trigger,
    control
  } = useForm<CartBodyType>({
    defaultValues,
    mode: "onChange"
  });

  const totalPrice = (carts || [])?.reduce(
    (acc, { totalPrice }) => acc + (totalPrice?.whole || 0),
    0
  );
  const formatedTotalPrice = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN"
  }).format(totalPrice);

  const checkout = useCallback(
    async (body: CartBodyType) => {
      setIsCheckingOut(true);
      try {
        setOrderStatus("Creating order...");
        const { data } = await postData<
          CartBodyType,
          ApiCallResponseType<OrderDetailsType>
        >("/order", body);
        const orderDetails = data?.data || {};
        if (!orderDetails) {
          toast.error("Unable to create order! Please try again");
        }
        clearCart();
        const { id } = orderDetails;
        setOrderStatus("Initializing payment...");
        updateOrder(orderDetails);
        const { data: paymentData } = await postData<
          { callbackUrl: string },
          ApiCallResponseType<PaymentDetailsType>
        >(`/payment/${id}`, {
          callbackUrl: `${window.location.origin}/orders/${id}/success`
        });

        updateOrder({ ...orderDetails, checkoutDetails: paymentData?.data });
        window.location.href = paymentData?.data?.authorization_url;
      } catch (error) {
        const errorsFromServer = (error as ApiErrorResponseType)?.response?.data
          ?.error;
        if (errorsFromServer) {
          const errorsFromServerKeys = Object.keys(errorsFromServer);
          errorsFromServerKeys.forEach((key, index) => {
            setError(
              key as keyof CartBodyType,
              { message: errorsFromServer[key]?.toString(), type: "validate" },
              { shouldFocus: index === 0 }
            );
          });
        }
        toast.error(
          constructErrorMessage(
            error as ApiErrorResponseType,
            "Unable to checkout! Please try again"
          )
        );
        setIsCheckingOut(false);
        setOrderStatus(null);
      }
    },
    [setError, updateOrder, clearCart]
  );

  const clearCartList = useCallback(async () => {
    if (clearingCart) {
      return;
    }
    setClearingCart(true);
    setOrderStatus("Clearing cart...");
    try {
      await deleteData(`/cart`);
      clearCart();
    } catch (error) {
      toast.error(
        constructErrorMessage(
          error as ApiErrorResponseType,
          "Unknown error occurred whilst clearing cart!"
        )
      );
    } finally {
      setClearingCart(false);
      setOrderStatus(null);
    }
  }, [clearCart, clearingCart]);

  useEffect(() => {
    if (userToken && !carts) {
      getCart();
    }
  }, [getCart, userToken, carts]);

  useEffect(() => {
    if ((isCheckingOut || clearingCart) && window) {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }, [isCheckingOut, clearingCart]);

  if (isCheckingOut || clearingCart) {
    return (
      <div className="w-screen h-[calc(100vh-25rem)] items-center justify-center flex flex-col gap-3">
        <Spinner />
        {orderStatus && <p className="text-center opacity-40">{orderStatus}</p>}
      </div>
    );
  }

  return (
    <PageLayout>
      {((carts && !cartFetchingError && carts.length > 0) ||
        (!carts && !cartFetchingError)) && (
        <form onSubmit={handleSubmit(checkout)} className="w-full relative">
          <SectionContainer contentContainerClassName="flex flex-col gap-10">
            <div className="flex items-center justify-between">
              <button onClick={back} className="inline-flex items-center gap-1">
                <span>
                  <FaAngleLeft />
                </span>
                <span>Back</span>
              </button>

              {carts && carts?.length > 0 && !cartFetchingError && (
                <button
                  disabled={clearingCart}
                  onClick={clearCartList}
                  aria-label="clear cart"
                  title="clear cart"
                  className="text-red-700 underline"
                >
                  Clear Cart
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 min-[1225px]:grid-cols-2 gap-10 md:gap-20 items-start">
              <div className="flex flex-col gap-10">
                {carts &&
                  carts.map(({ productDetails, id, quantity, totalPrice }) => (
                    <ProductCard
                      {...productDetails}
                      key={id}
                      id={productDetails?.id}
                      isCart
                      cartId={id}
                      type={productDetails?.type}
                      cartQuantity={quantity}
                      totalPrice={totalPrice}
                      quantity={productDetails?.quantity}
                    />
                  ))}

                {!carts &&
                  new Array(4)
                    .fill(0)
                    .map((_, index) => <ProductCardLoader key={index} />)}
              </div>

              {carts && doCartNeedAddress && (
                <div className="flex flex-col gap-5 min-[1225px]:sticky min-[1225px]:bottom-0 min-[1225px]:top-auto p-10 rounded-2xl bg-white shadow-xl border">
                  <InputField
                    inputClassName="rounded-xl"
                    label="Sender's Name"
                    {...register("senderName", {
                      required: "Please enter your name"
                    })}
                    error={errors?.senderName?.message}
                  />

                  <InputField
                    inputClassName="rounded-xl"
                    label="Receiver's Name"
                    {...register("receiverName", {
                      required: "Please enter receiver's name"
                    })}
                    error={errors?.receiverName?.message}
                  />
                  <Controller
                    control={control}
                    name="receiverAddress"
                    rules={{
                      required: "Please provide receiver address!"
                    }}
                    render={({
                      field: { value, onChange, ref },
                      fieldState: { error }
                    }) => (
                      <div className={`flex flex-col gap-2`}>
                        <div className={`flex flex-col gap-2`}>
                          <Label>Receiver&apos;s Full Address</Label>
                          <div
                            className={`w-full relative flex items-stretch justify-center`}
                          >
                            <Autocomplete
                              ref={ref}
                              defaultValue={value}
                              className={`w-full peer/radio-btn border ${
                                error?.message && "!border-red-400"
                              } py-3 px-5 outline-none rounded-md w-full h-full`}
                              apiKey={
                                process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY
                              }
                              onPlaceSelected={(place) => {
                                if (!place) {
                                  return;
                                }
                                const { lat, lng } =
                                  place?.geometry?.location || {};
                                onChange(place?.formatted_address);
                                if (lat && lng) {
                                  const latitude = lat();
                                  const longitude = lng();
                                  setValue("latitude", latitude);
                                  setValue("longitude", longitude);
                                }
                                trigger("receiverAddress");
                              }}
                            />
                          </div>
                          <p className="text-red-600 text-sm">
                            {error?.message}
                          </p>
                        </div>
                      </div>
                    )}
                  />
                  <InputField
                    inputClassName="rounded-xl"
                    label="Receiver's Phone Number"
                    {...register("receiverPhoneNumber", {
                      required: "Please enter receiver phone number",
                      pattern: {
                        value: phoneNumberRegExp,
                        message: "Phone number is required"
                      }
                    })}
                    error={errors?.receiverPhoneNumber?.message}
                  />
                  <TextArea
                    inputClassName="rounded-xl"
                    label="Short Note (optional)"
                    {...register("shortNote")}
                    error={errors?.shortNote?.message}
                  />
                  <div className="flex flex-col gap-2">
                    <h1 className="font-medium">NOTE</h1>

                    <p>
                      Don&apos;t Send P.O Box <br />{" "}
                      <span className="font-bold">Addresses</span> should
                      contain Zip code of the address-. The city name- Name of
                      street- With the house number-
                    </p>
                    <p>
                      Ensure your address is correct and complete, cross check
                      properly cause if package has issues cause of wrong or
                      incomplete address, we won&apos;t be held liable
                    </p>
                  </div>
                </div>
              )}
            </div>

            <hr className="border" />

            <div className="flex flex-col gap-5">
              <h1 className="font-medium">
                Total Amount:{" "}
                <span className="font-bold">{formatedTotalPrice}</span>
              </h1>
              <div className="grid grid-cols-2 max-w-[50rem] gap-4">
                <Button
                  type="submit"
                  loading={isCheckingOut}
                  buttonType="primary"
                  className="text-white rounded-md"
                >
                  Checkout
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    push("/products/gifts");
                  }}
                  buttonType="secondary"
                  className="text-white rounded-md"
                >
                  Back to store
                </Button>
              </div>
            </div>
          </SectionContainer>
        </form>
      )}
      {carts && !cartFetchingError && carts.length < 1 && (
        <EmptyContainer description="You have no cart at the moment!" />
      )}
      {cartFetchingError && (
        <ErrorContainer error={cartFetchingError} retryFunction={getCart} />
      )}
    </PageLayout>
  );
};

export default protectRoute(Cart);
