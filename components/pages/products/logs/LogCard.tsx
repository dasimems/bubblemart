import { deleteData, patchData } from "@/api";
import Button from "@/components/Button";
import InputField from "@/components/general/InputField";
import Spinner from "@/components/general/Spinner";
import { LogDetailsType } from "@/store/logStore";
import { constructErrorMessage } from "@/utils/functions";
import { Trash2 } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const defaultValues = {
  email: "",
  password: ""
};

const LogCard: React.FC<
  LogDetailsType & { index: number; refetch: <T>() => Promise<T | unknown> }
> = ({
  id,
  email = "",
  password = "",
  index = 0,
  refetch = async () => {}
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    handleSubmit,
    formState: { isDirty, isValid, isSubmitting },
    register,
    reset
  } = useForm({ defaultValues });

  const updateLog = useCallback(
    async (data: typeof defaultValues) => {
      try {
        await patchData(`/log/${id}`, data);
        await refetch();
        reset(data);
        toast.success("Log updated successfully!");
      } catch (error) {
        toast.error(
          constructErrorMessage(
            error as ApiErrorResponseType,
            "Unknown error occurred whilst updating products"
          )
        );
      }
    },
    [id, refetch, reset]
  );

  const deleteLog = useCallback(async () => {
    setIsDeleting(true);
    try {
      await deleteData(`/log/${id}`);
      await refetch();
      toast.success("Log deleted successfully!");
    } catch (error) {
      toast.error(
        constructErrorMessage(
          error as ApiErrorResponseType,
          "Unknown error occurred whilst deleting log"
        )
      );
    } finally {
      setIsDeleting(false);
    }
  }, [id, refetch]);

  useEffect(() => {
    reset({
      email,
      password
    });
  }, [reset, email, password]);
  return (
    <form
      onSubmit={handleSubmit(updateLog)}
      className="flex flex-col gap-6 bg-white p-5 rounded-md"
    >
      <div className="flex gap-5 items-center justify-between w-full">
        <h1 className="font-bold">Log {index + 1}</h1>
        {!isDeleting && (
          <button
            onClick={deleteLog}
            type="button"
            aria-label={`delete log ${index + 1}`}
            className="text-red-600"
            title={`delete log ${index + 1}`}
          >
            <Trash2 />
          </button>
        )}
        {isDeleting && <Spinner className="size-5 !border-2" />}
      </div>
      <InputField
        formClassName="!flex-row items-center !gap-4"
        label="Email:"
        labelClassName="font-bold"
        {...register("email", { setValueAs: (value) => value.trim() })}
      />
      <InputField
        formClassName="!flex-row items-center !gap-4"
        label="Password:"
        labelClassName="font-bold"
        {...register("password")}
      />
      {isDirty && (
        <Button
          disabled={!isValid || isSubmitting}
          buttonType="primary"
          className="self-start"
        >
          Update
        </Button>
      )}
    </form>
  );
};

export default LogCard;
