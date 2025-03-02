import { deleteData, postData } from "@/api";
import Button from "@/components/Button";
import InputField from "@/components/general/InputField";
import SelectBox from "@/components/general/SelectBox";
import TextArea from "@/components/general/TextArea";
import AccountContentLayout from "@/components/layouts/AccountContentLayout";
import LogForm, {
  LogBodyType,
  logInitialValue
} from "@/components/pages/products/LogForm";
import useProduct from "@/hooks/useProduct";
import useUser from "@/hooks/useUser";
import { ProductDetailsType, ProductType } from "@/store/useProductStore";
import { constructErrorMessage } from "@/utils/functions";
import { Trash } from "iconsax-react";
import { CircleAlert, TrashIcon, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

export type AddProductBodyType = {
  name: string;
  type: ProductType;
  quantity: number;
  amount: number;
  image: string;
  description: string;
  logs?: LogBodyType[];
};

const defaultValues: AddProductBodyType = {
  name: "",
  type: "log",
  quantity: 1,
  amount: 0,
  image: "",
  description: "",
  logs: []
};

const isImageFile = (file: File) => {
  // List of valid image MIME types
  const validImageMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/bmp"
  ];

  // Check if the file has a valid image MIME type
  return !!file && validImageMimeTypes.includes(file.type);
};

const validateLogs = (value?: LogBodyType[]) => {
  if (!value) {
    return "Please add at least one log";
  }
  if (value && value?.length < 1) {
    return "Please add at least one log";
  }
  const hasUnFilledValue = value.some((log) => !log.email || !log.password);

  if (hasUnFilledValue) {
    return "Please fill all logs fields";
  }
};

const Add = () => {
  const { userToken } = useUser();
  const { query, push, pathname } = useRouter();
  const [uploadingFileContent, setUploadingFileContent] = useState<
    string | null
  >(null);
  const [uploadingPercentage, setUploadingPercentage] = useState<number>(0);
  const [failedFileUpload, setFailedFileUpload] = useState<FileList | null>(
    null
  );

  const {
    setLogProducts,
    setGiftProducts,
    giftProducts,
    logProducts,
    getProducts
  } = useProduct();
  let { type } = query as { type?: ProductType };
  if (!type || (type !== "log" && type !== "gift")) {
    type = "log";
  }
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setError,
    setValue,
    watch,
    reset,
    trigger,
    getValues,
    control
  } = useForm({
    defaultValues,
    mode: "onChange"
  });

  const clearAllCachedImages = useCallback(() => {
    trigger();
    setValue("image", "");
    setFailedFileUpload(null);
    setUploadingFileContent(null);
    setUploadingPercentage(0);
  }, [setValue, trigger]);

  const selectedType = watch("type");
  const handlePush = useCallback(() => {
    if (selectedType && type !== selectedType) {
      push(`${pathname}?type=${selectedType}`);
    }
  }, [push, selectedType, type, pathname]);

  const toBase64 = (file: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const uploadAttachment = useCallback(
    async (files: FileList) => {
      if (!files) {
        toast.error("Could not find image to upload");
        return;
      }

      if (files.length > 1) {
        toast.error("You can only upload one image at a time");
        return;
      }
      if (files.length < 1) {
        toast.error("Please select an image to upload");
        return;
      }
      clearAllCachedImages();
      const file = files.item(0);

      if (!file) {
        toast.error("Please select an image to upload");
        return;
      }

      if (!isImageFile(file)) {
        toast.error("Please upload an image file");
        return;
      }

      try {
        const result = await toBase64(file);
        setUploadingFileContent(result as string);
        const formData = new FormData();
        formData.append("image", file);
        const { data } = await postData<
          FormData,
          ApiCallResponseType<{ link: string }>
        >("/upload", formData, {
          onUploadProgress: (progressEvent) => {
            setUploadingPercentage(
              Math.round(
                (progressEvent.loaded * 100) / (progressEvent?.total || 0)
              )
            );
          },
          headers: { "Content-Type": "multipart/form-data" }
        });
        trigger();
        setValue("image", data?.data?.link);
        setUploadingFileContent(null);
        setUploadingPercentage(0);
        setFailedFileUpload(null);
      } catch (error) {
        setError("image", {
          type: "validate",
          message: "Could not upload image"
        });
        toast.error("Could not upload image");
        setUploadingPercentage(0);
        setFailedFileUpload(files);
      }
    },
    [setError, setValue, clearAllCachedImages, trigger]
  );

  const onUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = e.currentTarget;
      if (!files) {
        toast.error("Could not find image to upload");
        return;
      }
      setValue("image", "");
      uploadAttachment(files);
      // show success message on file upload
    },
    [uploadAttachment, setValue]
  );

  const deletingImage = useCallback(async (path: string) => {
    try {
      await deleteData("/upload", {
        data: { path }
      });
    } catch (error) {
      toast.error(
        constructErrorMessage(
          error as ApiErrorResponseType,
          "Unknown error occurred whilst fetching order!"
        )
      );
    }
  }, []);

  const addProduct = useCallback(
    async (productBody: AddProductBodyType) => {
      const { type, logs, ...details } = productBody;
      let bodyToSend: AddProductBodyType = { ...details, type };
      if (logs) {
        bodyToSend = {
          ...bodyToSend,
          logs: (logs || []).filter(
            (logDetails) =>
              logDetails && logDetails.email && logDetails.password
          )
        };
      }
      try {
        const { data } = await postData<
          AddProductBodyType,
          ApiCallResponseType<ProductDetailsType>
        >("/product", bodyToSend);
        const { data: content } = data;
        if (type === "gift") {
          setGiftProducts([content, ...(giftProducts || [])]);
        }
        if (type === "log") {
          setLogProducts([content, ...(logProducts || [])]);
        }
        toast.success("Product added successfully");
        reset({ ...defaultValues, type });
      } catch (error) {
        toast.error(
          constructErrorMessage(
            error as ApiErrorResponseType,
            "Unable to add product! Please try again"
          )
        );
      }
    },
    [reset, logProducts, giftProducts, setGiftProducts, setLogProducts]
  );

  useEffect(() => {
    if (type && type !== selectedType && isFirstLoad) {
      setIsFirstLoad(false);
      reset({
        ...defaultValues,
        type
      });
    }
  }, [type, reset, selectedType, isFirstLoad]);

  useEffect(() => {
    if (selectedType && type !== selectedType && !isFirstLoad) {
      handlePush();
    }
  }, [selectedType, type, handlePush, isFirstLoad]);

  useEffect(() => {
    setValue("type", type);
  }, [type, setValue]);

  useEffect(() => {
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

  return (
    <AccountContentLayout>
      <h1 className="font-bold">Add {type}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <form
          onSubmit={handleSubmit(addProduct)}
          className="flex flex-col gap-4"
        >
          <SelectBox
            label="Product type"
            options={[
              {
                value: "log",
                label: "Log"
              },
              {
                value: "gift",
                label: "Gifts"
              }
            ]}
            placeholder="Select product type"
            {...register("type", {
              required: "Please select product type"
            })}
            error={errors?.type?.message}
          />
          <InputField
            label="Name"
            {...register("name", { required: "Please provide product name" })}
            error={errors?.name?.message}
          />

          {type === "gift" && (
            <InputField
              label="Quantity"
              {...register("quantity", {
                required: "Please provide product quantity",
                min: {
                  value: 1,
                  message:
                    "Your must have at least one of this product to be able to add to cart"
                },
                valueAsNumber: true
              })}
              error={errors?.quantity?.message}
            />
          )}
          <InputField
            label="Amount"
            leftIcon={<span className="border-r border-slate-300 pr-3">₦</span>}
            inputClassName="pl-14"
            placeholder="Product price"
            {...register("amount", {
              required: "Please provide your price",
              min: {
                value: 10,
                message: "Your price must not be less than ₦10"
              },
              valueAsNumber: true
            })}
            error={errors?.amount?.message}
          />
          <TextArea
            label="Description"
            {...register("description", {
              required: "Please provide product description"
            })}
            error={errors?.description?.message}
          />
          <Controller
            name="image"
            control={control}
            rules={{
              required: "Please upload your image"
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <div className="flex flex-col gap-2">
                <p className="">Image</p>
                {!value && !uploadingFileContent && (
                  <div className="border border-slate-400 border-dashed rounded-md h-[10rem] relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onUpload}
                      title="Click or drag to upload"
                      className="w-full h-full absolute top-0 left-0 opacity-0 z-10 cursor-pointer"
                    />
                    <div className="w-full h-full relative items-center justify-center p-5 flex flex-col gap-2">
                      <UploadCloud className="opacity-60" />
                      <p className="text-center opacity-60">
                        Click or drag to upload
                      </p>
                    </div>
                    {error?.message && (
                      <p className="text-sm text-red-600">{error?.message}</p>
                    )}
                  </div>
                )}

                {(uploadingFileContent || value) && (
                  <>
                    {!failedFileUpload && (
                      <div className="relative  w-32 h-36">
                        <div className="relative w-full h-full rounded-md overflow-hidden ">
                          <Image
                            src={uploadingFileContent || value}
                            fill
                            alt="product image"
                            className="object-cover"
                          />
                          {!value && (
                            <div className="w-full h-full absolute top-0 left-0 bg-black/70 z-20 flex flex-col text-xs items-center justify-center">
                              <UploadCloud className="opacity-60 text-white" />
                              <p className="text-center opacity-70 text-white">
                                <span className="font-bold">
                                  {uploadingPercentage}%
                                </span>{" "}
                                uploaded
                              </p>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          aria-label="remove image"
                          title="remove-image"
                          onClick={() => {
                            clearAllCachedImages();
                            if (value) {
                              deletingImage(value);
                            }
                          }}
                          className="absolute -top-1 rounded-full -right-1 text-xs text-white bg-red-600 z-30"
                        >
                          <X className="" />
                        </button>
                      </div>
                    )}
                    {failedFileUpload && (
                      <div className="border border-slate-400 border-dashed rounded-md h-[10rem] relative">
                        <div className="w-full h-full relative items-center justify-center p-5 flex flex-col gap-2">
                          <CircleAlert color="red" />
                          <p className="text-center text-xs text-red-600">
                            Could not upload image
                          </p>
                          <div className="flex items-center gap-2  text-sm ">
                            <button
                              type="button"
                              title="retry"
                              aria-label="retry"
                              className="underline text-primary"
                              onClick={() => uploadAttachment(failedFileUpload)}
                            >
                              Retry
                            </button>
                            <p className="no-underline text-black">/</p>
                            <button
                              type="button"
                              className="underline text-primary"
                              title="reselect image"
                              aria-label="reselect image"
                              onClick={() => {
                                clearAllCachedImages();
                              }}
                            >
                              Re-upload image
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          />

          {type === "log" && (
            <Controller
              name="logs"
              control={control}
              rules={{
                validate: validateLogs
              }}
              render={({
                field: { value, onChange },
                fieldState: { error }
              }) => (
                <div className="flex flex-col gap-2">
                  <LogForm logs={value || []} onChange={onChange} />
                  {error?.message && (
                    <p className="text-red-600 text-sm">{error?.message}</p>
                  )}
                </div>
              )}
            />
          )}
          <div className="flex justify-between">
            <Button
              className="self-start py-2"
              buttonType="primary"
              disabled={!isValid}
              loading={isSubmitting}
            >
              Add
            </Button>
            {type === "log" && (
              <Button
                onClick={() => {
                  const logValues = getValues("logs") || [];
                  const error = validateLogs(logValues);
                  if (error) {
                    setError("logs", {
                      type: "custom",
                      message: error
                    });
                    toast.error(error);
                    return;
                  }
                  setValue("logs", [...logValues, logInitialValue]);
                }}
                type="button"
                buttonType="default"
                className="border-primary border bg-transparent"
              >
                Add log
              </Button>
            )}
          </div>
        </form>
      </div>
    </AccountContentLayout>
  );
};

export default Add;
