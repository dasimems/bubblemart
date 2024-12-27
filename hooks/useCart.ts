import { getData } from "@/api";
import useCartStore, { CartDetailsType } from "@/store/useCartStore";
import { constructErrorMessage } from "@/utils/functions";
import { useCallback } from "react";

const useCart = () => {
  const { setCarts, setCartFetchingError, ...details } = useCartStore();
  const getCart = useCallback(async () => {
    try {
      const { data } = await getData<ApiCallResponseType<CartDetailsType[]>>(
        "/cart"
      );
      const { data: content } = data;
      setCarts(content);
    } catch (error) {
      setCartFetchingError(
        constructErrorMessage(
          error as ApiErrorResponseType,
          "Error encountered whilst fetching cart list"
        )
      );
    }
  }, [setCarts, setCartFetchingError]);

  return { getCart, ...details };
};

export default useCart;
