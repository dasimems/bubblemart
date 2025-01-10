import AccountContentLayout from "@/components/layouts/AccountContentLayout";
import React from "react";

const Account = () => {
  return (
    <AccountContentLayout>
      <h1 className="font-medium text-2xl">Dashboard</h1>

      <div className="bg-white p-5 rounded-md flex flex-col gap-4">
        <div className="flex item-center gap-6">
          <h1 className="font-bold">Overview</h1>
        </div>

        <div className="bg-slate-100 rounded-md p-3">
          <div className="bg-white rounded-md"></div>
        </div>
      </div>
    </AccountContentLayout>
  );
};

export default Account;
