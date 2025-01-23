import AccountContentLayout from "@/components/layouts/AccountContentLayout";
import EmptyContainer from "@/components/status/EmptyContainer";
import ErrorContainer from "@/components/status/ErrorContainer";
import useCustomers from "@/hooks/useCustomers";
import React, { use, useEffect } from "react";

const Users = () => {
  const tableContentClassname = "text-sm py-4";
  const loadingClassName = "animate-pulse h-3 bg-slate-300 rounded-md";
  const tableHeadTextStyle = `${tableContentClassname} font-medium text-center`;
  const tableLoadingContentStyle = `${tableContentClassname} px-2`;

  const { customers, fetchingCustomersError, getCustomers } = useCustomers();

  useEffect(() => {
    getCustomers();
  }, [getCustomers]);

  return (
    <AccountContentLayout>
      <div className="flex gap-10 items-center justify-between">
        <h1 className="font-bold">
          Users {customers ? `(${customers?.length})` : null}
        </h1>
        <p></p>
      </div>

      {customers && !fetchingCustomersError && customers.length < 1 && (
        <EmptyContainer />
      )}
      {!fetchingCustomersError &&
        (!customers || (customers && customers.length > 0)) && (
          <div className="w-full">
            <div className="w-full">
              <table className="w-full">
                <thead className="w-full">
                  <tr className="bg-white">
                    <th className={`${tableHeadTextStyle} w-[5rem]`}>S/N</th>
                    <th className={tableHeadTextStyle}>Name</th>
                    <th className={tableHeadTextStyle}>Date Joined</th>
                    <th className={tableHeadTextStyle}>Email</th>
                    <th className={tableHeadTextStyle}>User Type</th>
                  </tr>
                </thead>
                <tbody>
                  {!customers &&
                    !fetchingCustomersError &&
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
                  {customers &&
                    !fetchingCustomersError &&
                    customers.length > 0 &&
                    customers
                      .slice(0, 5)
                      .map((customers) => <tr key={customers?.id}></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        )}
      {fetchingCustomersError && (
        <ErrorContainer
          error={fetchingCustomersError}
          retryFunction={getCustomers}
        />
      )}
    </AccountContentLayout>
  );
};

export default Users;
