import { getData } from "@/api";
import useProductStore, {
  ProductDetailsType,
  ProductType
} from "@/store/useProductStore";
import { constructErrorMessage } from "@/utils/functions";
import { useCallback } from "react";

const useProduct = () => {
  const {
    setGiftProducts,
    setLogProducts,
    setFetchingLogProductsError,
    setFetchingGiftProductsError,
    ...details
  } = useProductStore();
  const getProducts = useCallback(
    async (type: ProductType = "gift") => {
      try {
        const { data } = await getData<
          ApiCallResponseType<ProductDetailsType[]>
        >(`/product?page=1&type=${type}`);
        const { data: content } = data;
        if (type === "gift") {
          setGiftProducts(content);
          setFetchingGiftProductsError();
        }
        if (type === "log") {
          setLogProducts(content);
          setFetchingLogProductsError();
        }
      } catch (error) {
        if (type === "gift") {
          setFetchingGiftProductsError(
            constructErrorMessage(
              error as ApiErrorResponseType,
              "Error encountered whilst fetching product list!"
            )
          );
        }
        if (type === "log") {
          setFetchingLogProductsError(
            constructErrorMessage(
              error as ApiErrorResponseType,
              "Error encountered whilst fetching product list!"
            )
          );
        }
      }
    },
    [
      setGiftProducts,
      setLogProducts,
      setFetchingLogProductsError,
      setFetchingGiftProductsError
    ]
  );
  return { getProducts, setGiftProducts, setLogProducts, ...details };
};

export default useProduct;
