import { getData } from "@/api";
import Button from "@/components/Button";
import PageLayout from "@/components/layouts/PageLayout";
import SectionContainer from "@/components/layouts/SectionContainer";
import ErrorContainer from "@/components/status/ErrorContainer";
import { OrderDetailsType } from "@/store/useOrderStore";
import { constructErrorMessage } from "@/utils/functions";
import moment from "moment";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

export const OrderDetailsCard: React.FC<{ title: string; value: string }> = ({
  title,
  value
}) => {
  return (
    <div className="flex flex-col items-start gap-2">
      <p className="opacity-60 text-sm">{title}</p>
      <h1 className="md:text-lg">{value}</h1>
    </div>
  );
};

const OrderDetails = () => {
  const { push } = useRouter();
  const [orderDetails, setOrderDetails] = useState<OrderDetailsType | null>(
    null
  );
  const [orderDetailsError, setFetchingOrderDetailsError] = useState<
    string | null
  >(null);
  const params = useParams();
  const { orderId } = params || {};
  const goToSuccessPage = useCallback(
    (isAlreadyVerified?: boolean) => {
      push(
        `/orders/${orderId}/success${
          isAlreadyVerified ? `?pid=${orderDetails?.paymentReference}` : ""
        }`
      );
    },
    [orderId, push, orderDetails]
  );
  const getOrderDetails = useCallback(async () => {
    if (!orderId) {
      return setFetchingOrderDetailsError("Order ID not found");
    }
    setFetchingOrderDetailsError(null);
    setOrderDetails(null);
    try {
      const { data } = await getData<ApiCallResponseType<OrderDetailsType>>(
        `/order/${orderId}`
      );
      const { data: orderContent } = data || {};
      setOrderDetails(orderContent);
    } catch (error) {
      setFetchingOrderDetailsError(
        constructErrorMessage(
          error as ApiErrorResponseType,
          "Error encountered whilst fetching order details"
        )
      );
    }
  }, [orderId]);
  useEffect(() => {
    getOrderDetails();
  }, [orderId, getOrderDetails]);
  return (
    <PageLayout>
      {!orderDetailsError && (
        <SectionContainer contentContainerClassName="flex flex-col gap-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold">Order details</h1>
          </div>

          {!orderDetailsError && orderDetails && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex flex-col gap-6 rounded-xl bg-white shadow-md p-8 py-10 ">
                <OrderDetailsCard
                  title="Order ID"
                  value={orderDetails?.id || ""}
                />
                <OrderDetailsCard
                  title="Created At"
                  value={moment(orderDetails?.createdAt).format(
                    "DD, MMMM YYYY hh:mm A"
                  )}
                />
                <OrderDetailsCard
                  title="Payment method"
                  value={orderDetails?.paymentMethod || ""}
                />
                <OrderDetailsCard
                  title="Status"
                  value={orderDetails?.status || ""}
                />
                <OrderDetailsCard
                  title="Paid At"
                  value={moment(orderDetails?.paidAt).format(
                    "DD, MMMM YYYY hh:mm A"
                  )}
                />
                <div className="flex items-center gap-4">
                  {!orderDetails?.paidAt && (
                    <Button
                      onClick={() => {
                        goToSuccessPage();
                      }}
                      buttonType="secondary"
                      className="text-white"
                    >
                      Verify Payment
                    </Button>
                  )}
                  {orderDetails?.paidAt && (
                    <Button
                      onClick={() => {
                        goToSuccessPage(true);
                      }}
                      buttonType="primary"
                      className="text-white"
                    >
                      View Receipt
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-6 rounded-xl">
                {(orderDetails?.cartItems || []).map((item) => (
                  <div
                    className="flex gap-4 items-start bg-white shadow-sm p-4 rounded-md"
                    key={item?.id}
                  >
                    <div className="size-10 bg-slate-100 rounded-full relative overflow-hidden">
                      <Image
                        fill
                        src={item?.productDetails?.image}
                        alt={item?.productDetails?.name}
                        className="object-cover object-center"
                      />
                    </div>
                    <div className="flex items-center flex-1">
                      <div className="flex flex-col gap-2 flex-1">
                        <h1 className="text-lg md:text-xl font-semibold">
                          {item?.productDetails?.name}
                        </h1>
                        <p className="">
                          <span>{item?.quantity}</span>&nbsp;&nbsp;
                          <span className="text-primary-100 font-semibold">
                            ({item?.totalPrice?.formatted?.withCurrency})
                          </span>
                        </p>
                      </div>

                      <div className="">
                        {orderDetails?.deliveredAt && (
                          <span className="text-xs bg-green-100 py-2 px-3 rounded-md text-green-900">
                            DELIVERED
                          </span>
                        )}
                        {orderDetails?.paidAt && !orderDetails?.deliveredAt && (
                          <span className="text-xs bg-primary-900 py-2 px-3 rounded-md text-primary-100">
                            PAID
                          </span>
                        )}
                        {!orderDetails?.paidAt &&
                          !orderDetails?.deliveredAt && (
                            <span className="text-xs bg-secondary-900 py-2 px-3 rounded-md text-secondary-300">
                              PENDING
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!orderDetailsError && !orderDetails && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="p-8 py-10 bg-white rounded-lg flex flex-col gap-6">
                {new Array(7).fill(0).map((_, index) => (
                  <div className="flex flex-col gap-2" key={index}>
                    <div className="w-[7rem] animate-pulse h-3 bg-slate-300 rounded-md" />
                    <div className="w-[14rem] animate-pulse h-3 bg-slate-300 rounded-md" />
                  </div>
                ))}
              </div>
              <div className="rounded-lg flex flex-col gap-6">
                {new Array(7).fill(0).map((_, index) => (
                  <div className="flex items-center gap-4" key={index}>
                    <div
                      key={index}
                      className="animate-pulse size-10 bg-slate-300 rounded-full"
                    />
                    <div className="flex flex-col gap-2">
                      <div className="w-[10rem] animate-pulse h-3 bg-slate-300 rounded-md" />
                      <div className="w-[6rem] animate-pulse h-3 bg-slate-300 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionContainer>
      )}

      {orderDetailsError && (
        <ErrorContainer
          error={orderDetailsError}
          retryFunction={getOrderDetails}
        />
      )}
    </PageLayout>
  );
};

export default OrderDetails;
