import ProductCardLoader from "@/components/general/ProductCardLoader";
import PageLayout from "@/components/layouts/PageLayout";
import SectionContainer from "@/components/layouts/SectionContainer";
import OrderCard from "@/components/pages/orders/OrderCard";
import OrderCardLoader from "@/components/pages/orders/OrderCardLoader";
// import ProductCard from "@/components/pages/home/ProductCard";
import EmptyContainer from "@/components/status/EmptyContainer";
import ErrorContainer from "@/components/status/ErrorContainer";
import protectRoute from "@/hooks/protectRoute";
import useOrder from "@/hooks/useOrder";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { FaAngleLeft } from "react-icons/fa";

const Orders = () => {
  const { getOrders, orders, fetchingOrderError } = useOrder();
  const { back, push } = useRouter();

  useEffect(() => {
    if (!orders) {
      getOrders();
    }
  }, [orders, getOrders]);

  return (
    <PageLayout>
      {((orders && !fetchingOrderError && orders.length > 0) ||
        (!orders && !fetchingOrderError)) && (
        <SectionContainer contentContainerClassName="flex flex-col gap-10">
          <div className="flex items-center">
            <button onClick={back} className="inline-flex items-center gap-1">
              <span>
                <FaAngleLeft />
              </span>
              <span>Back</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {!orders &&
              new Array(8)
                .fill(0)
                .map((_, index) => <OrderCardLoader key={index} />)}
            {orders &&
              orders.length > 0 &&
              orders.map((order) => <OrderCard {...order} key={order.id} />)}
          </div>
        </SectionContainer>
      )}

      {orders && !fetchingOrderError && orders.length < 1 && (
        <EmptyContainer description="You have no orders at the moment!" />
      )}
      {fetchingOrderError && (
        <ErrorContainer error={fetchingOrderError} retryFunction={getOrders} />
      )}
    </PageLayout>
  );
};

export default protectRoute(Orders);
