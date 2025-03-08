import { deleteData } from "@/api";
import Button from "@/components/Button";
import Spinner from "@/components/general/Spinner";
import AccountContentLayout from "@/components/layouts/AccountContentLayout";
import Modal from "@/components/Modal";
import EmptyContainer from "@/components/status/EmptyContainer";
import ErrorContainer from "@/components/status/ErrorContainer";
import useProduct from "@/hooks/useProduct";
import useUser from "@/hooks/useUser";
import { ProductDetailsType, ProductType } from "@/store/useProductStore";
import { constructErrorMessage } from "@/utils/functions";
import {
  EllipsisVertical,
  EyeIcon,
  File,
  PenSquare,
  TrashIcon
} from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const productTypeClassName: { [name: string]: string } = {
  gift: "bg-secondary/20 text-primary",
  log: "bg-primary/50"
};

const Products = () => {
  const { query } = useRouter();
  let { type } = query;
  if (!type || (type && type !== "gift" && type !== "log")) {
    type = "log";
  }
  const tableContentClassname = "text-sm py-4 text-center";
  const loadingClassName = "animate-pulse h-3 bg-slate-300 rounded-md";
  const tableHeadTextStyle = `${tableContentClassname} font-medium text-center`;
  const actionContentClassName =
    "hover:bg-primary/10 p-2 px-3 w-full text-left cursor-pointer";

  const actionButtonClassName = "w-full inline-flex gap-2 items-center";
  const tableLoadingContentStyle = `${tableContentClassname} px-2`;
  const [clickedProductId, setClickedProductId] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductDetailsType[] | null>(null);
  const [deletingProductIds, setDeletingProductIds] = useState<string[]>([]);
  const [productToDelete, setProductToDelete] =
    useState<ProductDetailsType | null>(null);
  const [productsFetchingError, setProductsFetchingError] = useState<
    string | null
  >(null);

  const { userToken } = useUser();
  const {
    giftProducts,
    logProducts,
    fetchingGiftProductsError,
    fetchingLogProductsError,
    isNextGiftProductLoading,
    isNextLogProductLoading,
    getProducts,
    removeProduct
  } = useProduct();

  const deleteProduct = useCallback(async () => {
    if (!productToDelete) {
      return toast.error("Unable to identify products!");
    }
    setDeletingProductIds((prevState) => [...prevState, productToDelete?.id]);
    setProductToDelete(null);
    try {
      await deleteData(`/product/${productToDelete?.id}`);
      removeProduct(productToDelete?.id);
      toast.success(`${productToDelete?.name} deleted successfully!`);
    } catch (error) {
      toast.error(
        constructErrorMessage(
          error as ApiErrorResponseType,
          "Unknown error occurred whilst deleting product!"
        )
      );
    } finally {
      setDeletingProductIds((prevState) =>
        prevState?.filter((id) => id !== productToDelete?.id)
      );
    }
  }, [productToDelete, removeProduct]);

  useEffect(() => {
    setProducts(null);

    if (userToken) {
      if (type) {
        if (type === "gift" && !giftProducts) {
          getProducts("gift");
        }
        if (type === "log" && !logProducts) {
          getProducts("log");
        }
      }
    }
  }, [type, giftProducts, logProducts, getProducts, userToken]);

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
    <>
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
                      <th className={tableHeadTextStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!products &&
                      !productsFetchingError &&
                      new Array(7).fill(0).map((_, index) => (
                        <tr key={index} className="">
                          <td
                            className={`${tableLoadingContentStyle} w-[5rem]`}
                          >
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
                          <td className={tableLoadingContentStyle}>
                            <div className={loadingClassName} />
                          </td>
                        </tr>
                      ))}
                    {products &&
                      !productsFetchingError &&
                      products.length > 0 &&
                      products.slice(0, 5).map((product, index) => {
                        const isDeletingProduct = deletingProductIds?.includes(
                          product?.id
                        );
                        // const isDeletingProduct = true;

                        return (
                          <tr
                            key={product?.id}
                            className={`${index % 2 === 1 && "bg-white/60"}`}
                          >
                            <td className={tableContentClassname}>
                              {index + 1}
                            </td>
                            <td className={tableContentClassname}>
                              {product?.name}
                            </td>
                            <td className={tableContentClassname}>
                              {moment(product?.createdAt).format(
                                "DD, MMMM YYYY hh:mm A"
                              )}
                            </td>
                            <td
                              className={`${tableContentClassname} ${
                                !product?.quantity && "text-red-500 font-bold"
                              }`}
                            >
                              {product?.quantity}
                            </td>
                            <td className={tableContentClassname}>
                              <span
                                className={`p-1 px-2 rounded-md text-xs ${productTypeClassName[type]}`}
                              >
                                {product?.type?.toUpperCase()}
                              </span>
                            </td>
                            <td className={tableContentClassname}>
                              {!isDeletingProduct && (
                                <button
                                  aria-label={`${product?.name} actions`}
                                  onClick={() => {
                                    setClickedProductId((prevState) =>
                                      prevState === product?.id
                                        ? null
                                        : product?.id
                                    );
                                  }}
                                  title={`${product?.name} actions`}
                                  className="relative"
                                >
                                  <EllipsisVertical />
                                  {clickedProductId === product?.id && (
                                    <span className="absolute top-[102%] right-0 z-10 text-left">
                                      <ul className="bg-white shadow-md rounded-md flex flex-col items-start min-w-28">
                                        <li className={actionContentClassName}>
                                          <Link
                                            href={`/account/products/${product?.id}`}
                                            className={actionButtonClassName}
                                          >
                                            <span>
                                              <EyeIcon size={15} />
                                            </span>
                                            <span>View</span>
                                          </Link>
                                        </li>
                                        {type === "log" && (
                                          <li
                                            className={actionContentClassName}
                                          >
                                            <Link
                                              href={`/account/products/logs/${product?.id}`}
                                              className={actionButtonClassName}
                                            >
                                              <span>
                                                <File size={15} />
                                              </span>
                                              <span>Logs</span>
                                            </Link>
                                          </li>
                                        )}
                                        <li className={actionContentClassName}>
                                          <Link
                                            href={`/account/products/edit?id=${product?.id}`}
                                            className={actionButtonClassName}
                                          >
                                            <span>
                                              <PenSquare size={15} />
                                            </span>
                                            <span>Edit</span>
                                          </Link>
                                        </li>
                                        <button
                                          onClick={() => {
                                            setProductToDelete(product);
                                          }}
                                          className={`${actionContentClassName} ${actionButtonClassName} text-red-600`}
                                        >
                                          <span>
                                            <TrashIcon size={15} />
                                          </span>
                                          <span>Delete</span>
                                        </button>
                                      </ul>
                                    </span>
                                  )}
                                </button>
                              )}
                              {isDeletingProduct && (
                                <div className="flex items-center justify-center">
                                  <Spinner className="!size-4 !border-2" />
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        {productsFetchingError && (
          <ErrorContainer
            error={productsFetchingError}
            retryFunction={() => {
              getProducts(type as ProductType);
              setProductsFetchingError(null);
            }}
          />
        )}
      </AccountContentLayout>
      <Modal
        opened={!!productToDelete}
        onClose={() => {
          setProductToDelete(null);
        }}
        position="center"
      >
        <div className="flex flex-col p-3 bg-white rounded-md items-center gap-6 w-[90vw] md:w-screen max-w-[25rem]">
          <h1 className="text-center max-w-[250px]">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-uppercase">
              {productToDelete?.name}
            </span>
          </h1>
          <div className="flex items-center justify-center gap-3">
            <Button
              onClick={() => {
                setProductToDelete(null);
              }}
              buttonType="default"
              className="text-xs !py-2 rounded-md"
            >
              Cancel
            </Button>
            <Button
              onClick={deleteProduct}
              buttonType="secondary"
              className="text-xs !py-2 rounded-md"
            >
              Continue
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Products;
