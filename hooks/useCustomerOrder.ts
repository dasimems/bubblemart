import { getData } from "@/api";
import useCustomerOrderStore from "@/store/useCustomerOrderStore";
import { OrderDetailsType } from "@/store/useOrderStore";
import { constructErrorMessage } from "@/utils/functions";
import { useCallback } from "react";

const useCustomerOrder = () => {
  const { setOrders, setFetchingOrderError, ...details } =
    useCustomerOrderStore();
  const getOrders = useCallback(async () => {
    setFetchingOrderError();
    try {
      const { data } = await getData<ApiCallResponseType<OrderDetailsType[]>>(
        "/order?type=admin"
      );
      const { data: content } = data;
      setOrders(content);
    } catch (error) {
      setFetchingOrderError(
        constructErrorMessage(
          error as ApiErrorResponseType,
          "Unknown error occurred whilst fetching order!"
        )
      );
    }
  }, [setOrders, setFetchingOrderError]);
  return { getOrders, ...details };
};

export default useCustomerOrder;
