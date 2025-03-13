import SectionContainer from "@/components/layouts/SectionContainer";
import React, { useCallback, useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import ProductCardLoader from "@/components/general/ProductCardLoader";
import { ProductDetailsType } from "@/store/useProductStore";
import { getData } from "@/api";
import ErrorContainer from "@/components/status/ErrorContainer";
import EmptyContainer from "@/components/status/EmptyContainer";
import { constructErrorMessage } from "../../../utils/functions";
import { useQuery } from "@tanstack/react-query";

export type ProductsPropsType = {
  hideTitle?: boolean;
};

const Products: React.FC<ProductsPropsType> = ({ hideTitle }) => {
  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["landing-products"],
    queryFn: () =>
      getData<ApiCallResponseType<ProductDetailsType[]>>("/product?max=6")
  });

  const [products, setProducts] = useState<ProductDetailsType[] | null>(null);
  const [productsFetchingError, setProductsFetchingError] = useState<
    string | null
  >(null);

  // const getProducts = useCallback(async () => {
  //   setProductsFetchingError(null);
  //   setProducts(null);
  //   try {
  //     const { data } = await getData<ApiCallResponseType<ProductDetailsType[]>>(
  //       "/product?max=6"
  //     );
  //     const { data: content } = data;
  //     setProducts(content);
  //   } catch (error) {
  //     setProductsFetchingError(
  //       constructErrorMessage(
  //         error as ApiErrorResponseType,
  //         "Error encountered whilst fetching product list!"
  //       )
  //     );
  //   }
  // }, []);

  // useEffect(() => {
  //   getProducts();
  // }, [getProducts]);

  useEffect(() => {
    setProducts(data?.data?.data || null);
  }, [data]);

  useEffect(() => {
    if (error) {
      setProductsFetchingError(
        constructErrorMessage(
          error as ApiErrorResponseType,
          "Error encountered whilst fetching product list!"
        )
      );
    }
    if (!error) {
      setProductsFetchingError(null);
    }
  }, [error]);
  return (
    <SectionContainer contentContainerClassName="gap-10 flex flex-col">
      {!hideTitle && (
        <h1 className="max-w-[300px] font-bold text-[clamp(1.2rem,5vw,2rem)] self-center text-center">
          Explore what <br /> we have for you.
        </h1>
      )}

      {products && !productsFetchingError && products.length < 1 && (
        <EmptyContainer />
      )}

      {!productsFetchingError &&
        (!products || (products && products.length > 0)) && (
          <div className="grid grid-cols-2 gap-2 md:gap-14">
            {!products &&
              !productsFetchingError &&
              new Array(4)
                .fill(0)
                .map((_, index) => <ProductCardLoader key={index} />)}

            {products &&
              !productsFetchingError &&
              products.length > 0 &&
              products
                .slice(0, 5)
                .map((product) => (
                  <ProductCard {...product} key={product?.id} />
                ))}
          </div>
        )}
      {productsFetchingError && (
        <ErrorContainer error={productsFetchingError} retryFunction={refetch} />
      )}
    </SectionContainer>
  );
};

export default Products;
