import { getData } from "@/api";
import useCartStore, { CartDetailsType } from "@/store/useCartStore";
import { constructErrorMessage } from "@/utils/functions";
import { useCallback } from "react";

const useCart = () => {
  const { setCarts, setCartFetchingError, setCartNeedAddress, ...details } =
    useCartStore();
  const getCart = useCallback(async () => {
    setCartFetchingError();
    try {
      const { data } = await getData<
        ApiCallResponseType<{
          carts: CartDetailsType[];
          isAddressNeeded: boolean;
        }>
      >("/cart");
      const { data: content } = data;
      setCarts(content?.carts || []);
      setCartNeedAddress(content?.isAddressNeeded);
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
