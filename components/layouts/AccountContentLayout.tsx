import React from "react";

type AccountContentLayoutProp = {
  children: React.ReactNode;
};
const AccountContentLayout: React.FC<AccountContentLayoutProp> = ({
  children
}) => {
  return <div className="py-4 px-10 flex flex-col gap-6">{children}</div>;
};

export default AccountContentLayout;
