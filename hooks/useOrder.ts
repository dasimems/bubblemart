import { getData } from "@/api";
import useOrderStore, { OrderDetailsType } from "@/store/useOrderStore";
import { constructErrorMessage } from "@/utils/functions";
import { useCallback } from "react";

const useOrder = () => {
  const { setOrders, setFetchingOrderError, ...details } = useOrderStore();
  const getOrders = useCallback(async () => {
    setFetchingOrderError();
    try {
      const { data } = await getData<ApiCallResponseType<OrderDetailsType[]>>(
        "/order"
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

export default useOrder;
