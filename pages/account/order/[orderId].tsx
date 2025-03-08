import { getData } from "@/api";
import Button from "@/components/Button";
import AccountContentLayout from "@/components/layouts/AccountContentLayout";
import ErrorContainer from "@/components/status/ErrorContainer";
import { OrderDetailsCard } from "@/pages/orders/[orderId]";
import { OrderDetailsType } from "@/store/useOrderStore";
import { constructErrorMessage, generateCacheKey } from "@/utils/functions";
import moment from "moment";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { productTypeClassName } from "../products";
import Map from "@/components/general/Map";
import { useQuery } from "@tanstack/react-query";

const OrderDetails = () => {
  const params = useParams();
  const { orderId } = params || {};
  const tableContentClassname = "text-sm py-4 px-3 text-center";
  const loadingClassName = "animate-pulse h-3 bg-slate-300 rounded-md";
  const tableHeadTextStyle = `${tableContentClassname} font-medium`;
  const tableLoadingContentStyle = `${tableContentClassname} px-2`;

  const { push } = useRouter();
  const [orderDetails, setOrderDetails] = useState<OrderDetailsType | null>(
    null
  );
  const [orderDetailsError, setFetchingOrderDetailsError] = useState<
    string | null
  >(!orderId ? "Order id not found!" : null);
  const { isPending, error, data, refetch } = useQuery({
    queryKey: [generateCacheKey(orderId?.toString()).details],
    queryFn: () =>
      getData<ApiCallResponseType<OrderDetailsType>>(
        `/order/${orderId}?isAdmin=true`
      ),
    enabled: !!orderId
  });
  const contactInformation = orderDetails?.contactInformation;
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
  useEffect(() => {
    setOrderDetails(data?.data?.data || null);
  }, [data]);

  useEffect(() => {
    if (error) {
      setFetchingOrderDetailsError(
        constructErrorMessage(
          error as ApiErrorResponseType,
          "Error encountered whilst fetching product list!"
        )
      );
    }
  }, [error]);
  return (
    <AccountContentLayout>
      {!orderDetailsError && orderDetails && (
        <div className="flex flex-col gap-14 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col gap-6 rounded-xl bg-white shadow-md p-8 py-10 ">
              <h1 className="font-bold">Order details</h1>
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

            <div className="flex flex-col gap-6 rounded-xl bg-white shadow-md p-8 py-10 ">
              <h1 className="font-bold">Customer details</h1>
              <OrderDetailsCard
                title="Name"
                value={orderDetails?.user?.name || ""}
              />
              <OrderDetailsCard
                title="Email"
                value={orderDetails?.user?.email || ""}
              />
              <OrderDetailsCard
                title="Joined On"
                value={moment(orderDetails?.user?.createdAt).format(
                  "DD, MMMM YYYY hh:mm A"
                )}
              />
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => {
                    push(`/account/users/${orderDetails?.user?.id}`);
                  }}
                  buttonType="secondary"
                  className="text-white"
                >
                  View user details
                </Button>
              </div>
            </div>
          </div>
          {contactInformation && (
            <>
              <div className="flex flex-col gap-6 rounded-xl bg-white shadow-md p-8 py-10 ">
                <h1 className="font-bold">Contact details</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  <OrderDetailsCard
                    title="Sender name"
                    value={contactInformation?.senderName || ""}
                  />
                  <OrderDetailsCard
                    title="Receiver name"
                    value={contactInformation?.receiverName || ""}
                  />
                  <OrderDetailsCard
                    title="Receiver Address"
                    value={contactInformation?.receiverAddress || ""}
                  />
                  <OrderDetailsCard
                    title="Receiver Mobile number"
                    value={contactInformation?.receiverPhoneNumber || ""}
                  />
                </div>
                {contactInformation?.shortNote && (
                  <OrderDetailsCard
                    title="Short note"
                    value={contactInformation?.shortNote || ""}
                  />
                )}
              </div>
              <Map
                longitude={contactInformation?.longitude || 0}
                latitude={contactInformation?.latitude || 0}
              />
            </>
          )}
          <div className="w-full flex flex-col gap-10">
            <h1 className="text-2xl font-semibold">
              Order items ({orderDetails?.cartItems?.length || 0})
            </h1>
            <table className="w-full">
              <thead>
                <tr className=" bg-white">
                  <th className={`${tableHeadTextStyle} w-[5rem]`}>S/N</th>
                  <th className={tableHeadTextStyle}>Product</th>
                  <th className={tableHeadTextStyle}>Date added</th>
                  <th className={tableHeadTextStyle}>Quantity</th>
                  <th className={tableHeadTextStyle}>Amount (&#8358;)</th>
                  <th className={tableHeadTextStyle}>Type</th>
                  <th className={tableHeadTextStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {(orderDetails?.cartItems || [])?.map((item, index) => (
                  <tr
                    key={item?.id}
                    className={`${(index + 1) % 2 === 0 ? "bg-white/50" : ""}`}
                  >
                    <td className={tableContentClassname}>{index + 1}</td>
                    <td className={tableContentClassname}>
                      {item?.productDetails?.name}
                    </td>
                    <td className={tableContentClassname}>
                      {moment(item?.productDetails?.createdAt).format(
                        "DD, MMMM YYYY hh:mm A"
                      )}
                    </td>
                    <td className={tableContentClassname}>{item?.quantity}</td>
                    <td className={tableContentClassname}>
                      {item?.productDetails?.amount?.formatted?.withCurrency}
                    </td>
                    <td className={tableContentClassname}>
                      <span
                        className={`p-1 px-2 rounded-md text-xs ${
                          productTypeClassName[
                            item?.productDetails?.type?.toLowerCase()
                          ]
                        }`}
                      >
                        {item?.productDetails?.type?.toUpperCase()}
                      </span>
                    </td>
                    <td className={tableContentClassname}>
                      <div className="">
                        {orderDetails?.deliveredAt && (
                          <span className="text-xs text-green-900">
                            DELIVERED
                          </span>
                        )}
                        {orderDetails?.paidAt && !orderDetails?.deliveredAt && (
                          <span className="text-xs text-primary-100">PAID</span>
                        )}
                        {!orderDetails?.paidAt &&
                          !orderDetails?.deliveredAt && (
                            <span className="text-xs text-secondary-300">
                              PENDING
                            </span>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {!orderDetailsError && !orderDetails && (
        <div className="flex flex-col gap-10">
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
          <table className="w-full">
            <tbody>
              {new Array(7).fill(0).map((_, index) => (
                <tr key={index}>
                  <td className={`${tableLoadingContentStyle} w-[5rem]`}>
                    <div className={loadingClassName} />
                  </td>
                  <td className={tableLoadingContentStyle}>
                    <div className={loadingClassName} />
                  </td>
                  <td className={tableLoadingContentStyle}>
                    <div className={loadingClassName} />
                  </td>
                  <td className={tableLoadingContentStyle}>
                    <div className={loadingClassName} />
                  </td>
                  <td className={tableLoadingContentStyle}>
                    <div className={loadingClassName} />
                  </td>
                  <td className={tableLoadingContentStyle}>
                    <div className={loadingClassName} />
                  </td>
                  <td className={tableLoadingContentStyle}>
                    <div className={loadingClassName} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {orderDetailsError && (
        <ErrorContainer error={orderDetailsError} retryFunction={refetch} />
      )}
    </AccountContentLayout>
  );
};

export default OrderDetails;
