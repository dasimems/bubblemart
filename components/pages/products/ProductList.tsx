import SectionContainer from "@/components/layouts/SectionContainer";
import React, { useEffect, useState } from "react";
import ProductCardLoader from "@/components/general/ProductCardLoader";
import { ProductDetailsType } from "@/store/useProductStore";
import useProduct from "@/hooks/useProduct";
import ProductCard from "../home/ProductCard";
import EmptyContainer from "@/components/status/EmptyContainer";
import ErrorContainer from "@/components/status/ErrorContainer";
import { useParams } from "next/navigation";

export type ProductsPropsType = {
  hideTitle?: boolean;
};

const ProductList: React.FC<ProductsPropsType> = ({ hideTitle }) => {
  const [products, setProducts] = useState<ProductDetailsType[] | null>(null);
  const [productsFetchingError, setProductsFetchingError] = useState<
    string | null
  >(null);
  let { productType } = useParams<{ productType?: "gifts" | "logs" }>() || {};
  if (productType !== "gifts" && productType !== "logs") {
    productType = "logs";
  }
  const {
    giftProducts,
    logProducts,
    fetchingGiftProductsError,
    fetchingLogProductsError,
    isNextGiftProductLoading,
    isNextLogProductLoading,
    getProducts
  } = useProduct();

  useEffect(() => {
    setProducts(null);

    if (productType) {
      if (productType === "gifts" && !giftProducts) {
        getProducts("gift");
      }
      if (productType === "logs" && !logProducts) {
        getProducts("log");
      }
    }
  }, [productType, giftProducts, logProducts, getProducts]);

  useEffect(() => {
    if (productType) {
      if (productType === "gifts") {
        if (giftProducts) {
          setProducts(giftProducts);
        }
        if (fetchingGiftProductsError) {
          setProductsFetchingError(fetchingGiftProductsError);
        }
      }
      if (productType === "logs") {
        if (logProducts) {
          setProducts(logProducts);
        }
        if (fetchingLogProductsError) {
          setProductsFetchingError(fetchingLogProductsError);
        }
      }
    }
  }, [
    productType,
    logProducts,
    giftProducts,
    fetchingLogProductsError,
    fetchingGiftProductsError
  ]);

  return (
    <SectionContainer contentContainerClassName="gap-10 flex flex-col">
      {/* {!hideTitle && (
        <h1 className="max-w-[300px] font-bold text-[clamp(1.2rem,5vw,2rem)] self-center text-center">
          Explore what <br /> we have for you.
        </h1>
      )} */}

      {products && !productsFetchingError && products.length < 1 && (
        <EmptyContainer />
      )}

      {!productsFetchingError &&
        (!products || (products && products.length > 0)) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
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
        <ErrorContainer
          error={productsFetchingError}
          retryFunction={getProducts}
        />
      )}
    </SectionContainer>
  );
};

export default ProductList;
