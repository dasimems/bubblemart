import ProductCardLoader from "@/components/general/ProductCardLoader";
import PageLayout from "@/components/layouts/PageLayout";
import SectionContainer from "@/components/layouts/SectionContainer";
// import ProductCard from "@/components/pages/home/ProductCard";
import EmptyContainer from "@/components/status/EmptyContainer";
import ErrorContainer from "@/components/status/ErrorContainer";
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-start">
            {/* {orders &&
                orders.map(({ cartItems: {}, id }) => (
                  <ProductCard {...productDetails} key={id} />
                ))} */}
            {!orders &&
              new Array(4)
                .fill(0)
                .map((_, index) => <ProductCardLoader key={index} />)}
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

export default Orders;
