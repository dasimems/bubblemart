import Button from "@/components/Button";
import InputField from "@/components/general/InputField";
import ProductCardLoader from "@/components/general/ProductCardLoader";
import TextArea from "@/components/general/TextArea";
import PageLayout from "@/components/layouts/PageLayout";
import SectionContainer from "@/components/layouts/SectionContainer";
import ProductCard from "@/components/pages/home/ProductCard";
import EmptyContainer from "@/components/status/EmptyContainer";
import ErrorContainer from "@/components/status/ErrorContainer";
import useCart from "@/hooks/useCart";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { FaAngleLeft } from "react-icons/fa";

const Cart = () => {
  const { back, push } = useRouter();
  const { getCart, carts, cartFetchingError, doCartNeedAddress } = useCart();
  const { userToken } = useUser();

  useEffect(() => {
    if (userToken) {
      getCart();
    }
  }, [getCart, userToken]);

  return (
    <PageLayout>
      {((carts && !cartFetchingError && carts.length > 0) ||
        (!carts && !cartFetchingError)) && (
        <SectionContainer contentContainerClassName="flex flex-col gap-10">
          <div className="flex items-center">
            <button onClick={back} className="inline-flex items-center gap-1">
              <span>
                <FaAngleLeft />
              </span>
              <span>Back</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-start">
            <div className="flex flex-col gap-10">
              {carts &&
                carts.map(({ productDetails, id }) => (
                  <ProductCard {...productDetails} key={id} />
                ))}

              {!carts &&
                new Array(4)
                  .fill(0)
                  .map((_, index) => <ProductCardLoader key={index} />)}
            </div>

            {carts && doCartNeedAddress && (
              <form className="flex flex-col gap-5 sticky bottom-0 top-auto p-10 rounded-2xl bg-white shadow-xl border">
                <InputField inputClassName="rounded-xl" label="Sender's Name" />
                <InputField
                  inputClassName="rounded-xl"
                  label="Receiver's Name"
                />
                <InputField
                  inputClassName="rounded-xl"
                  label="Receiver's Full Address"
                />
                <InputField
                  inputClassName="rounded-xl"
                  label="Receiver's Phone Number"
                />
                <TextArea
                  inputClassName="rounded-xl"
                  label="Short Note (optional)"
                />

                <div className="flex flex-col gap-2">
                  <h1 className="font-medium">NOTE</h1>

                  <p>
                    Don&apos;t Send P.O Box <br />{" "}
                    <span className="font-bold">Addresses</span> should contain
                    Zip code of the address-. The city name- Name of street-
                    With the house number-
                  </p>
                  <p>
                    Ensure your address is correct and complete, cross check
                    properly cause if package has issues cause of wrong or
                    incomplete address, we won&apos;t be held liable
                  </p>
                </div>
              </form>
            )}
          </div>

          <hr className="border" />

          <div className="flex flex-col gap-5">
            <h1 className="font-medium">
              Total Amount: <span className="font-bold">₦100</span>
            </h1>
            <div className="grid grid-cols-2 max-w-[50rem] gap-4">
              <Button buttonType="primary" className="text-white rounded-md">
                Checkout
              </Button>
              <Button
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
      )}
      {carts && !cartFetchingError && Cart.length < 1 && (
        <EmptyContainer description="You have no cart at the moment!" />
      )}
      {cartFetchingError && (
        <ErrorContainer error={cartFetchingError} retryFunction={getCart} />
      )}
    </PageLayout>
  );
};

export default Cart;
