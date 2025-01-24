import AccountContentLayout from "@/components/layouts/AccountContentLayout";
import EmptyContainer from "@/components/status/EmptyContainer";
import ErrorContainer from "@/components/status/ErrorContainer";
import useCustomerOrder from "@/hooks/useCustomerOrder";
import useUser from "@/hooks/useUser";
import React, { use, useEffect } from "react";

const Payments = () => {
  const tableContentClassname = "text-sm py-4";
  const loadingClassName = "animate-pulse h-3 bg-slate-300 rounded-md";
  const tableHeadTextStyle = `${tableContentClassname} font-medium text-center`;
  const tableLoadingContentStyle = `${tableContentClassname} px-2`;
  const { userToken } = useUser();
  const { orders, fetchingOrderError, getOrders } = useCustomerOrder();

  useEffect(() => {
    if (userToken) {
      getOrders();
    }
  }, [getOrders, userToken]);

  return (
    <AccountContentLayout>
      <div className="flex gap-10 items-center justify-between">
        <h1 className="font-bold">
          Orders {orders ? `(${orders?.length})` : null}
        </h1>
        <p></p>
      </div>

      {orders && !fetchingOrderError && orders.length < 1 && <EmptyContainer />}
      {!fetchingOrderError && (!orders || (orders && orders.length > 0)) && (
        <div className="w-full">
          <div className="w-full">
            <table className="w-full">
              <thead className="w-full">
                <tr className="bg-white">
                  <th className={`${tableHeadTextStyle} w-[5rem]`}>S/N</th>
                  <th className={tableHeadTextStyle}>User</th>
                  <th className={tableHeadTextStyle}>Initiated on</th>
                  <th className={tableHeadTextStyle}>Paid at</th>
                  <th className={tableHeadTextStyle}>Total products</th>
                </tr>
              </thead>
              <tbody>
                {!orders &&
                  !fetchingOrderError &&
                  new Array(7).fill(0).map((_, index) => (
                    <tr key={index} className="">
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
                    </tr>
                  ))}
                {orders &&
                  !fetchingOrderError &&
                  orders.length > 0 &&
                  orders
                    .slice(0, 5)
                    .map((orders) => <tr key={orders?.id}></tr>)}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {fetchingOrderError && (
        <ErrorContainer error={fetchingOrderError} retryFunction={getOrders} />
      )}
    </AccountContentLayout>
  );
};

export default Payments;
