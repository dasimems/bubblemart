import { getData } from "@/api";
import { useCallback } from "react";

const useCart = () => {
  const getCart = useCallback(async () => {
    try {
      const { data } = await getData<ApiCallResponseType<CartDetailsType>>(
        "/cart"
      );
      const { data: content } = data;
      console.log("content", content);
    } catch (error) {
      console.log("error", error);
    }
  }, []);

  return { getCart };
};

export default useCart;
