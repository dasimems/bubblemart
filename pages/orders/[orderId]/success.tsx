import { getData } from "@/api";
import { WrittenLogo } from "@/assets/images";
import { PaymentSuccessfulAnimation } from "@/assets/lotties";
import Spinner from "@/components/general/Spinner";
import PageLayout from "@/components/layouts/PageLayout";
import SectionContainer from "@/components/layouts/SectionContainer";
import ErrorContainer from "@/components/status/ErrorContainer";
import protectRoute from "@/hooks/protectRoute";
import { OrderDetailsType } from "@/store/useOrderStore";
import { constructErrorMessage } from "@/utils/functions";
import moment from "moment";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const OrderDetailsCard: React.FC<{ value: string; label: string }> = ({
  value,
  label
}) => {
  return (
    <div className="flex gap-3 items-center py-3 px-4 rounded-md shadow-sm">
      <div className="w-full max-w-32">
        <p className="opacity-60">{label}:</p>
      </div>
      <div className="flex-1 text-right">
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
};

const tdClassName =
  "border-b border-gray-200 py-3 px-4 text-center text-xs md:text-sm";
const thClassName = `${tdClassName} font-semibold opacity-60`;

const formatPaymentMethod = (paymentMethod?: string) => {
  if (!paymentMethod) {
    return "-";
  }
  const splitedText = paymentMethod.split("_").join(" ");

  return splitedText.charAt(0).toUpperCase() + splitedText.slice(1);
};

const OrderSuccessful = () => {
  const param = useParams();
  const { orderId } = param || {};
  const [verifyingOrderError, setVerifyingOrderError] = useState<string | null>(
    null
  );
  const [orderDetails, setOrderDetails] = useState<OrderDetailsType | null>(
    null
  );

  const verifyOrder = useCallback(async () => {
    if (orderDetails) {
      return;
    }
    if (!orderId) {
      return setVerifyingOrderError("Unknown error occurred !");
    }
    setVerifyingOrderError(null);
    try {
      const { data } = await getData<ApiCallResponseType<OrderDetailsType>>(
        `/payment/${orderId}`
      );
      const { data: orderData } = data;
      setOrderDetails(orderData);
    } catch (error) {
      setVerifyingOrderError(
        constructErrorMessage(
          error as ApiErrorResponseType,
          "Unknown error occurred whilst fetching order!"
        )
      );
    }
  }, [orderDetails, orderId]);

  useEffect(() => {
    verifyOrder();
  }, [orderId, verifyOrder]);

  if (verifyingOrderError) {
    return (
      <PageLayout>
        <SectionContainer contentContainerClassName="flex items-center flex-col">
          <ErrorContainer error={verifyingOrderError} />
          <Link href="/" className="text-primary underline">
            Go to home
          </Link>
        </SectionContainer>
      </PageLayout>
    );
  }
  if (!orderDetails) {
    return (
      <PageLayout>
        <SectionContainer contentContainerClassName="flex items-center flex-col gap-6 h-[calc(100vh-25rem)] w-screen justify-center">
          <Spinner />
          <p className="text-center text-lg font-semibold">
            Verifying order...
          </p>
        </SectionContainer>
      </PageLayout>
    );
  }

  return (
    <>
      <PageLayout>
        <div className="w-full h-full fixed items-center justify-center flex flex-col">
          <Image
            alt="logo"
            className="w-[100vh] md:w-full object-contain opacity-10 -rotate-45 "
            src={WrittenLogo}
          />
        </div>
        <SectionContainer contentContainerClassName="flex flex-col items-center gap-10 md:backdrop-blur-sm md:bg-white/30 rounded-2xl p-10">
          <div className="flex flex-col items-center gap-2">
            <Lottie
              animationData={PaymentSuccessfulAnimation}
              autoPlay={true}
              loop={false}
              className="size-40 md:size-56"
            />
            <h1 className="font-semibold text-2xl">Payment Verified!</h1>
          </div>
          <div className="flex flex-col  gap-2 w-full max-w-[40rem] text-xs md:text-sm ">
            <OrderDetailsCard label="Order ID" value={orderDetails?.id || ""} />
            <OrderDetailsCard
              label="Paid At"
              value={moment(orderDetails?.paidAt).format(
                "DD, MMMM YYYY hh:mm A"
              )}
            />
            <OrderDetailsCard
              label="Payment method"
              value={formatPaymentMethod(orderDetails?.paymentMethod)}
            />
          </div>
          <table className="w-full  max-w-[40rem]">
            <thead>
              <tr>
                <th className={`${thClassName} w-14`}>S/N</th>
                <th className={thClassName}>Product</th>
                <th className={thClassName}>Quantity</th>
                <th className={thClassName}>Amount (&#8358;)</th>
                <th className={thClassName}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails?.cartItems?.map((cartItem, index) => (
                <tr>
                  <td className={tdClassName}>{index + 1}</td>
                  <td className={tdClassName}>
                    {cartItem?.productDetails?.name}
                  </td>
                  <td className={tdClassName}>{cartItem?.quantity}</td>
                  <td className={tdClassName}>
                    {cartItem?.productDetails?.amount?.formatted?.withCurrency}
                  </td>
                  <td className={`${tdClassName} text-xs`}>PAID</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td
                  className={`${tdClassName} !text-left font-semibold`}
                  colSpan={4}
                >
                  Total:
                </td>
                <td
                  className={`${tdClassName} font-medium text-xs`}
                  colSpan={2}
                >
                  300
                </td>
              </tr>
            </tfoot>
          </table>
        </SectionContainer>
      </PageLayout>
    </>
  );
};

export default protectRoute(OrderSuccessful);
