import AccountContentLayout from "@/components/layouts/AccountContentLayout";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { AvatarImage } from "@/assets/images";
import { UserDetailsType } from "@/store/useUserStore";
import { useParams } from "next/navigation";
import { constructErrorMessage, generateCacheKey } from "@/utils/functions";
import { getData } from "@/api";
import ErrorContainer from "@/components/status/ErrorContainer";
import { OrderDetailsCard } from "@/pages/orders/[orderId]";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";

const UserDetails = () => {
  const params = useParams();
  const { userId } = params || {};
  const [userDetails, setUserDetails] = useState<UserDetailsType | null>(null);
  const [userDetailsError, setUserDetailsError] = useState<string | null>(
    !userId ? "User id not found!" : null
  );
  const { isPending, error, data, refetch } = useQuery({
    queryKey: [generateCacheKey(userId?.toString()).details],
    queryFn: () =>
      getData<ApiCallResponseType<UserDetailsType>>(`/user/${userId}`),
    enabled: !!userId
  });
  useEffect(() => {
    setUserDetails(data?.data?.data || null);
  }, [data]);

  useEffect(() => {
    if (error) {
      setUserDetailsError(
        constructErrorMessage(
          error as ApiErrorResponseType,
          "Error encountered whilst fetching product list!"
        )
      );
    }
    if (!error) {
      setUserDetailsError(null);
    }
  }, [error]);
  return (
    <AccountContentLayout>
      <div className="flex gap-10 items-center justify-between">
        <h1 className="font-bold">User Details</h1>
      </div>
      {userDetails && !userDetailsError && (
        <div className="flex gap-10 items-start flex-col">
          <div className="flex gap-6 items-start w-full">
            <div className="w-full bg-slate-200 max-w-60 h-64 rounded-md overflow-hidden relative">
              <Image
                src={AvatarImage}
                alt="user avatar"
                fill
                className="object-cover object-center"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 flex-1 bg-white rounded-md p-5">
              <OrderDetailsCard title="Name" value={userDetails?.name} />
              <OrderDetailsCard title="Email" value={userDetails?.email} />
              <OrderDetailsCard
                title="Joined On"
                value={moment(userDetails?.createdAt).format(
                  "DD, MMMM YYYY hh:mm A"
                )}
              />
              <OrderDetailsCard
                title="Total cart"
                value={userDetails?.totalCarts?.toString() || "0"}
              />
              <OrderDetailsCard
                title="Total Orders"
                value={userDetails?.totalOrders?.toString() || "0"}
              />
              <OrderDetailsCard
                title="Completed Orders"
                value={userDetails?.totalCompletedOrders?.toString() || "0"}
              />
            </div>
          </div>
        </div>
      )}
      {!userDetails && !userDetailsError && (
        <div className="flex gap-10 items-start">
          <div className="w-full bg-slate-200 max-w-60 h-64 rounded-md overflow-hidden relative animate-pulse"></div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 bg-white rounded-md p-5 gap-6 md:gap-10">
            {new Array(6).fill(0).map((_, index) => (
              <div className="flex flex-col gap-2" key={index}>
                <div
                  key={index}
                  className="bg-slate-200 h-2 rounded-md animate-pulse w-20"
                />
                <div
                  key={index}
                  className="bg-slate-200 h-2 rounded-md animate-pulse w-36"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {userDetailsError && (
        <ErrorContainer error={userDetailsError} retryFunction={refetch} />
      )}
    </AccountContentLayout>
  );
};

export default UserDetails;
