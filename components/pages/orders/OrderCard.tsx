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
  paymentReference,
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
  const verifyPaymentURL = `/orders/${id}/success?pid=${paymentReference}`;
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
        paymentReference,
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
    handleRedirectToCheckout,
    paymentReference
  ]);
  return (
    <div className="shadow-sm bg-white py-3 px-5 rounded-md flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10">
      <div className="flex flex-1 sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center">
          {cartItems?.slice(0, 3).map((cart, index) => (
            <div
              key={cart?.id}
              className={`size-10 shrink-0 rounded-full bg-slate-200 relative overflow-hidden shadow-sm ${
                index === 0 ? "" : "sm:-ml-5 -mt-5 sm:mt-0"
              }`}
            >
              <Image
                src={cart?.productDetails?.image}
                alt={cart?.productDetails?.name}
                fill
                className="object-cover object-center"
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <p className="font-medium opacity-50">
            {orderTitle}
            {cartItems?.length > 3 && `& ${cartItems?.length - 3} more...`}
          </p>
          <p className="opacity-50 text-sm">
            {moment(createdAt).format("DD, MMMM YYYY hh:mm A")}
          </p>
          <div className="gap-2 flex items-center sm:hidden text-xs">
            <Link href={`/orders/${id}`} className="underline text-primary-100">
              View details
            </Link>
            {paidAt && (
              <Link title="view receipt" href={verifyPaymentURL}>
                <FileCheck className="text-secondary" size={20} />
              </Link>
            )}

            {!paidAt && (
              <>
                {checkoutDetails && (
                  <Button
                    disabled={initiatingPayment}
                    onClick={() => {
                      handleRedirectToCheckout(
                        checkoutDetails?.authorization_url
                      );
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
      </div>
      <div className="gap-4 sm:flex items-center hidden sm:justify-end">
        <Link href={`/orders/${id}`} className="underline text-primary-100">
          View details
        </Link>
        {paidAt && (
          <Link title="view receipt" href={verifyPaymentURL}>
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
