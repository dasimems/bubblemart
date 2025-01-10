import { postData } from "@/api";
import Button from "@/components/Button";
import InputField from "@/components/general/InputField";
import SelectBox from "@/components/general/SelectBox";
import TextArea from "@/components/general/TextArea";
import AccountContentLayout from "@/components/layouts/AccountContentLayout";
import useProduct from "@/hooks/useProduct";
import { ProductDetailsType, ProductType } from "@/store/useProductStore";
import { constructErrorMessage } from "@/utils/functions";
import { Trash } from "iconsax-react";
import { TrashIcon, UploadCloud } from "lucide-react";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type LogBodyType = {
  email: string;
  password: string;
  error?: string;
};

export type AddProductBodyType = {
  name: string;
  type: ProductType;
  quantity: number;
  amount: number;
  image: string;
  description: string;
  log?: LogBodyType[];
};

const defaultValues: AddProductBodyType = {
  name: "",
  type: "log",
  quantity: 1,
  amount: 0,
  image: "",
  description: "",
  log: []
};

const Add = () => {
  const { query, push, pathname } = useRouter();
  const [logs, setLogs] = useState<LogBodyType[]>([
    {
      email: "",
      password: ""
    }
  ]);
  const { setLogProducts, setGiftProducts, giftProducts, logProducts } =
    useProduct();
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
    watch,
    reset,
    control
  } = useForm({
    defaultValues
  });

  const selectedType = watch("type");
  const handlePush = useCallback(() => {
    if (selectedType && type !== selectedType) {
      push(`${pathname}?type=${selectedType}`);
    }
  }, [push, selectedType, type, pathname]);

  const changeValue = useCallback((sentIndex: number, sentValue: LogBodyType)=>{
    setLogs(prevState => prevState.map((value, index) => index === sentIndex? sentValue : value))
  }, [])

  const addProduct = useCallback(
    async (productBody: AddProductBodyType) => {
      const { type } = productBody;
      try {
        const { data } = await postData<
          AddProductBodyType,
          ApiCallResponseType<ProductDetailsType>
        >("/product", productBody);
        const { data: content } = data;
        if (type === "gift") {
          setGiftProducts([...(giftProducts || []), content]);
        }
        if (type === "log") {
          setLogProducts([...(logProducts || []), content]);
        }
        toast.success("Product added successfully");
        reset(defaultValues);
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
                <div className="border border-slate-400 border-dashed rounded-md h-[10rem] relative">
                  <input
                    type="file"
                    accept="image/*"
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
              </div>
            )}
          />

          {type === "log" && (
            <div className="flex flex-col gap-6">
              <h2 className="font-medium">Logs</h2>
              {(logs || []).map(({ email, password, error }, index) => (
                <div
                  className="flex flex-col gap-2 p-6 border border-dotted rounded-md relative border-slate-400"
                  key={index}
                >
                  {logs.length > 1 && (
                    <button
                      title="remove log"
                      className="absolute top-2 right-2"
                    >
                      <Trash className="text-red-600" />
                    </button>
                  )}
                  <InputField
                    label="Email/Username"
                    key={index}
                    value={email}
                    onChange={(e) => {
                      const inputtedValue = (e?.target as HTMLInputElement)
                        ?.value;
                      changeValue(index, {
                        email: inputtedValue,
                        password
                      });
                    }}
                  />
                  <InputField
                    label="Password"
                    key={index}
                    value={password}
                    onChange={(e) => {
                      const inputtedValue = (e?.target as HTMLInputElement)
                        ?.value;
                      changeValue(index, {
                        email,
                        password: inputtedValue
                      });
                    }}
                  />
                </div>
              ))}
            </div>
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
            <Button
              buttonType="default"
              className="border-primary border bg-transparent"
            >
              Add log
            </Button>
          </div>
        </form>
      </div>
    </AccountContentLayout>
  );
};

export default Add;
