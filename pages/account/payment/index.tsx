import AccountContentLayout from "@/components/layouts/AccountContentLayout";
import EmptyContainer from "@/components/status/EmptyContainer";
import ErrorContainer from "@/components/status/ErrorContainer";
import usePayments from "@/hooks/usePayments";
import React, { use, useEffect } from "react";

const Payments = () => {
  const tableContentClassname = "text-sm py-4";
  const loadingClassName = "animate-pulse h-3 bg-slate-300 rounded-md";
  const tableHeadTextStyle = `${tableContentClassname} font-medium text-center`;
  const tableLoadingContentStyle = `${tableContentClassname} px-2`;

  const { payments, fetchingPaymentsError, getPayments } = usePayments();

  useEffect(() => {
    getPayments();
  }, [getPayments]);

  return (
    <AccountContentLayout>
      <div className="flex gap-10 items-center justify-between">
        <h1 className="font-bold">
          Payments {payments ? `(${payments?.length})` : null}
        </h1>
        <p></p>
      </div>

      {payments && !fetchingPaymentsError && payments.length < 1 && (
        <EmptyContainer />
      )}
      {!fetchingPaymentsError &&
        (!payments || (payments && payments.length > 0)) && (
          <div className="w-full">
            <div className="w-full">
              <table className="w-full">
                <thead className="w-full">
                  <tr className="bg-white">
                    <th className={`${tableHeadTextStyle} w-[5rem]`}>S/N</th>
                    <th className={tableHeadTextStyle}>User</th>
                    <th className={tableHeadTextStyle}>Initiated on</th>
                    <th className={tableHeadTextStyle}>Paid at</th>
                    <th className={tableHeadTextStyle}>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {!payments &&
                    !fetchingPaymentsError &&
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
                  {payments &&
                    !fetchingPaymentsError &&
                    payments.length > 0 &&
                    payments
                      .slice(0, 5)
                      .map((payments) => <tr key={payments?.id}></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        )}
      {fetchingPaymentsError && (
        <ErrorContainer
          error={fetchingPaymentsError}
          retryFunction={getPayments}
        />
      )}
    </AccountContentLayout>
  );
};

export default Payments;
