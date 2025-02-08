import { postData } from "@/api";
import Button from "@/components/Button";
import useOrder from "@/hooks/useOrder";
import { OrderDetailsType, PaymentDetailsType } from "@/store/useOrderStore";
import { constructErrorMessage } from "@/utils/functions";
import { uriRegExp } from "@/utils/regex";
import { FileCheck, Text } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";

const OrderCard: React.FC<OrderDetailsType> = ({
  cartItems,
  id,
  createdAt,
  paidAt,
  checkoutDetails,
  ...orderContent
}) => {
  const [initiatingPayment, setInitiatingPayment] = useState(false);
  const { updateOrder } = useOrder();
  const orderTitle = cartItems?.slice(0, 3)?.reduce((acc, item, index) => {
    return acc + `${index !== 0 ? ", " : ""}${item.productDetails.name}`;
  }, "");
  const handleRedirectToCheckout = useCallback((url: string) => {
    if (!url || !uriRegExp.test(url)) {
      return;
    }
    window.location.href = url;
  }, []);
  const handlePayment = useCallback(async () => {
    setInitiatingPayment(true);
    try {
      const { data: paymentData } = await postData<
        { callbackUrl: string },
        ApiCallResponseType<PaymentDetailsType>
      >(`/payment/${id}`, {
        callbackUrl: `${window.location.origin}/orders/${id}/success`
      });

      updateOrder({
        cartItems,
        id,
        createdAt,
        paidAt,
        ...orderContent,
        checkoutDetails: paymentData?.data
      });
      handleRedirectToCheckout(paymentData?.data?.authorization_url);
    } catch (error) {
      toast.error(
        constructErrorMessage(
          error as ApiErrorResponseType,
          "Unable to initiate payment! Please try again"
        )
      );
      setInitiatingPayment(false);
    }
  }, [
    id,
    orderContent,
    cartItems,
    createdAt,
    paidAt,
    updateOrder,
    handleRedirectToCheckout
  ]);
  return (
    <div className="shadow-sm bg-white py-3 px-5 rounded-md flex items-center gap-20">
      <div className="flex flex-1 items-center gap-4">
        {cartItems?.slice(0, 3).map((cart, index) => (
          <div
            key={cart?.id}
            className="size-10 rounded-full bg-slate-200 relative overflow-hidden shadow-sm"
            style={{
              marginLeft: index === 0 ? 0 : -10
            }}
          >
            <Image
              src={cart?.productDetails?.image}
              alt={cart?.productDetails?.name}
              fill
              className="object-cover object-center"
            />
          </div>
        ))}
        <div className="flex flex-col gap-2">
          <p className="font-medium opacity-50">
            {orderTitle}
            {cartItems?.length > 3 && `& ${cartItems?.length - 3} more...`}
          </p>
          <p className="opacity-50 text-sm">
            {moment(createdAt).format("DD, MMMM YYYY hh:mm A")}
          </p>
        </div>
      </div>
      <div className="gap-4 flex items-center justify-end">
        <Link href={`/orders/${id}`} className="underline text-primary-100">
          View details
        </Link>
        {paidAt && (
          <Link title="view receipt" href={`/orders/${id}/success`}>
            <FileCheck className="text-secondary" />
          </Link>
        )}

        {!paidAt && (
          <>
            {checkoutDetails && (
              <Button
                disabled={initiatingPayment}
                onClick={() => {
                  handleRedirectToCheckout(checkoutDetails?.authorization_url);
                }}
                buttonType="primary"
                size={"small"}
              >
                Complete payment
              </Button>
            )}
            {!checkoutDetails && (
              <Button
                loading={initiatingPayment}
                onClick={handlePayment}
                buttonType="primary"
                size={"small"}
              >
                Pay now
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
