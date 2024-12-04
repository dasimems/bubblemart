import React from "react";
import AccountSidebar from "../general/AccountSidebar";
import AccountNav from "../general/AccountNav";

export type AccountLayoutProp = {
  children: React.ReactNode;
};

const AccountLayout: React.FC<AccountLayoutProp> = ({ children }) => {
  return (
    <section className="flex items-start">
      <AccountSidebar />
      <div className="flex-1 flex flex-col gap-4 bg-slate-100 min-h-screen">
        <AccountNav />
        {children}
      </div>
    </section>
  );
};

export default AccountLayout;
