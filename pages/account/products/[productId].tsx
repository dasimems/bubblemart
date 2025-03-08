import { deleteData, getData } from "@/api";
import Button from "@/components/Button";
import Spinner from "@/components/general/Spinner";
import AccountContentLayout from "@/components/layouts/AccountContentLayout";
import Modal from "@/components/Modal";
import ErrorContainer from "@/components/status/ErrorContainer";
import useProduct from "@/hooks/useProduct";
import { ProductDetailsType } from "@/store/useProductStore";
import { constructErrorMessage, generateCacheKey } from "@/utils/functions";
import { useQuery } from "@tanstack/react-query";
import { PenSquare, TrashIcon } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

const loadingClassName = "animate-pulse bg-slate-300 rounded-md";

type ContentComponentType = {
  title: string;
  value?: string;
  isLoading: boolean;
};

const buttonClassName = "inline-flex items-center gap-2";

const ContentComponent: React.FC<ContentComponentType> = ({
  title,
  value,
  isLoading
}) => {
  return (
    <div className="flex flex-col items-start gap-1">
      <h1 className="opacity-60">{title}</h1>
      <div className="">
        {isLoading && <div className={`${loadingClassName} h-3 w-44`} />}
        {!isLoading && <p className="font-semibold text-lg">{value}</p>}
      </div>
    </div>
  );
};

const ProductDetails = () => {
  const { push } = useRouter();
  const { removeProduct } = useProduct();
  const params = useParams();
  const { productId } = params || {};
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openIsDeletingProductModal, setOpenIsDeletingProductModal] =
    useState(false);
  const [productDetailsFetchingError, setProductDetailsFetchingError] =
    useState<string | null>(!productId ? "Product id not found!" : null);
  const [productDetails, setProductDetails] =
    useState<ProductDetailsType | null>(null);

  const { isPending, error, data, refetch } = useQuery({
    queryKey: [generateCacheKey(productId?.toString()).details],
    queryFn: () =>
      getData<ApiCallResponseType<ProductDetailsType>>(
        `/product/${productId}?isAdmin=true`
      ),
    enabled: !!productId
  });

  const deleteProduct = useCallback(async () => {
    if (!productId) {
      return toast.error("Unable to identify products!");
    }
    setOpenDeleteModal(false);
    setOpenIsDeletingProductModal(true);
    try {
      await deleteData(`/product/${productId}`);
      push(`/account/products?type=${productDetails?.type}`);
      removeProduct(productId?.toString());
      toast.success(`${productDetails?.name} deleted successfully!`);
    } catch (error) {
      toast.error(
        constructErrorMessage(
          error as ApiErrorResponseType,
          "Unknown error occurred whilst deleting order!"
        )
      );
    } finally {
      setOpenIsDeletingProductModal(false);
    }
  }, [productId, push, productDetails, removeProduct]);

  useEffect(() => {
    setProductDetails(data?.data?.data || null);
  }, [data]);

  useEffect(() => {
    if (error) {
      setProductDetailsFetchingError(
        constructErrorMessage(
          error as ApiErrorResponseType,
          "Error encountered whilst fetching product list!"
        )
      );
    }
    if (!error) {
      setProductDetailsFetchingError(null);
    }
  }, [error]);

  return (
    <>
      <AccountContentLayout>
        {productDetailsFetchingError && (
          <ErrorContainer
            error={productDetailsFetchingError}
            retryFunction={refetch}
          />
        )}
        {!productDetailsFetchingError && (
          <div className="flex flex-col item-start gap-6">
            <div className="flex flex-col gap-2">
              {productDetails && (
                <div className="flex items-center gap-10 justify-between">
                  <h1 className="text-2xl font-semibold">
                    {productDetails?.name}
                  </h1>

                  {productDetails?.type === "log" && (
                    <Button
                      buttonType="primary"
                      onClick={() => {
                        push(`/account/products/logs/${productId}`);
                      }}
                    >
                      View logs
                    </Button>
                  )}
                </div>
              )}
              {!productDetails && (
                <div className={`${loadingClassName} h-3 w-44`} />
              )}
            </div>

            <div className="w-full flex flex-col md:flex-row gap-6 md:gap-10">
              <div className="w-full max-w-52">
                {productDetails && (
                  <div className="w-full h-56 relative overflow-hidden rounded-md">
                    <Image
                      alt={productDetails?.name}
                      src={productDetails?.image}
                      fill
                      className="w-full object-cover"
                    />
                  </div>
                )}
                {!productDetails && (
                  <div className={`${loadingClassName} w-full h-52`} />
                )}
              </div>
              <div className="flex-1 flex-col gap-6 flex">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
                  <ContentComponent
                    title="Name"
                    value={productDetails?.name}
                    isLoading={!productDetails}
                  />
                  <ContentComponent
                    title="Type"
                    value={productDetails?.type}
                    isLoading={!productDetails}
                  />
                  <ContentComponent
                    title="Quantity"
                    value={productDetails?.quantity?.toString()}
                    isLoading={!productDetails}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
                  <ContentComponent
                    title="Date Added"
                    value={moment(productDetails?.createdAt).format(
                      "DD, MMMM YYYY hh:mm A"
                    )}
                    isLoading={!productDetails}
                  />
                  <ContentComponent
                    title="Amount"
                    value={productDetails?.amount?.formatted?.withCurrency}
                    isLoading={!productDetails}
                  />
                  <ContentComponent
                    title="Total sales"
                    value={(productDetails?.totalSales || 0)?.toString()}
                    isLoading={!productDetails}
                  />
                </div>
                <ContentComponent
                  title="Description"
                  value={productDetails?.description}
                  isLoading={!productDetails}
                />
              </div>
            </div>

            <div className="flex items-center flex-row gap-4">
              <Button
                disabled={!productDetails}
                onClick={() => {
                  push(`/account/products/edit?id=${productDetails?.id}`);
                }}
                buttonType="primary"
                className={buttonClassName}
              >
                <span>
                  <PenSquare size={14} />
                </span>
                <span>Edit</span>
              </Button>
              <Button
                disabled={!productDetails}
                buttonType="secondary"
                className={buttonClassName}
                onClick={() => {
                  setOpenDeleteModal(true);
                }}
              >
                <span>
                  <TrashIcon size={14} />
                </span>
                <span>Delete</span>
              </Button>
            </div>
          </div>
        )}
      </AccountContentLayout>
      <Modal
        opened={openDeleteModal}
        onClose={() => {
          setOpenDeleteModal(false);
        }}
        position="center"
      >
        <div className="flex flex-col p-3 bg-white rounded-md items-center gap-6 w-[90vw] md:w-screen max-w-[25rem]">
          <h1 className="text-center max-w-[250px]">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-uppercase">
              {productDetails?.name}
            </span>
          </h1>
          <div className="flex items-center justify-center gap-3">
            <Button
              onClick={() => {
                setOpenDeleteModal(false);
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
      <Modal
        opened={openIsDeletingProductModal}
        onClose={() => {}}
        position="center"
      >
        <Spinner />
      </Modal>
    </>
  );
};

export default ProductDetails;
