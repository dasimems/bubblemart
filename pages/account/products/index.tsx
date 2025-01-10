import AccountContentLayout from "@/components/layouts/AccountContentLayout";
import EmptyContainer from "@/components/status/EmptyContainer";
import ErrorContainer from "@/components/status/ErrorContainer";
import useProduct from "@/hooks/useProduct";
import { ProductDetailsType } from "@/store/useProductStore";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Products = () => {
  const { query } = useRouter();
  let { type } = query;
  if (!type) {
    type = "log";
  }
  const tableContentClassname = "text-sm py-4";
  const loadingClassName = "animate-pulse h-3 bg-slate-300 rounded-md";
  const tableHeadTextStyle = `${tableContentClassname} font-medium text-center`;
  const tableLoadingContentStyle = `${tableContentClassname} px-2`;
  const [products, setProducts] = useState<ProductDetailsType[] | null>(null);
  const [productsFetchingError, setProductsFetchingError] = useState<
    string | null
  >(null);
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

    if (type) {
      if (type === "gift" && !giftProducts) {
        getProducts("gift");
      }
      if (type === "log" && !logProducts) {
        getProducts("log");
      }
    }
  }, [type, giftProducts, logProducts, getProducts]);

  useEffect(() => {
    if (type) {
      if (type === "gift") {
        if (giftProducts) {
          setProducts(giftProducts);
        }
        if (fetchingGiftProductsError) {
          setProductsFetchingError(fetchingGiftProductsError);
        }
      }
      if (type === "log") {
        if (logProducts) {
          setProducts(logProducts);
        }
        if (fetchingLogProductsError) {
          setProductsFetchingError(fetchingLogProductsError);
        }
      }
    }
  }, [
    type,
    logProducts,
    giftProducts,
    fetchingLogProductsError,
    fetchingGiftProductsError
  ]);

  return (
    <AccountContentLayout>
      <div className="flex gap-10 items-center justify-between">
        <h1 className="font-bold">Products ({type})</h1>
        <Link
          className="py-3 px-4 bg-primary rounded-md text-white text-sm"
          href={`/account/products/add?type=${type}`}
        >
          Add new {type}
        </Link>
      </div>

      {products && !productsFetchingError && products.length < 1 && (
        <EmptyContainer />
      )}
      {!productsFetchingError &&
        (!products || (products && products.length > 0)) && (
          <div className="w-full">
            <div className="w-full">
              <table className="w-full">
                <thead className="w-full">
                  <tr className="bg-white">
                    <th className={`${tableHeadTextStyle} w-[5rem]`}>S/N</th>
                    <th className={tableHeadTextStyle}>Name</th>
                    <th className={tableHeadTextStyle}>Date added</th>
                    <th className={tableHeadTextStyle}>Quantity</th>
                    <th className={tableHeadTextStyle}>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {!products &&
                    !productsFetchingError &&
                    new Array(7).fill(0).map((_, index) => (
                      <tr key={index} className="">
                        <td className={`${tableLoadingContentStyle} w-[5rem]`}>
                          <div className={loadingClassName} />
                        </td>
                        <td className={tableLoadingContentStyle}>
                          <div className={loadingClassName} />
                        </td>
                        <td className={tableLoadingContentStyle}>
                          <div className={loadingClassName} />
                        </td>
                        <td className={tableLoadingContentStyle}>
                          <div className={loadingClassName} />
                        </td>
                        <td className={tableLoadingContentStyle}>
                          <div className={loadingClassName} />
                        </td>
                      </tr>
                    ))}
                  {products &&
                    !productsFetchingError &&
                    products.length > 0 &&
                    products
                      .slice(0, 5)
                      .map((product) => <tr key={product?.id}></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        )}
      {productsFetchingError && (
        <ErrorContainer
          error={productsFetchingError}
          retryFunction={getProducts}
        />
      )}
    </AccountContentLayout>
  );
};

export default Products;
