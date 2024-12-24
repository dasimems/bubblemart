import { postData } from "@/api";
import Button from "@/components/Button";
import InputField from "@/components/general/InputField";
import AuthLayout from "@/components/layouts/AuthLayout";
import { constructErrorMessage } from "@/utils/functions";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { MdCancel } from "react-icons/md";

export type LoginBodyType = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
};

const defaultValues: LoginBodyType = {
  email: "",
  password: "",
  confirmPassword: "",
  name: ""
};

const Register = () => {
  const { push } = useRouter();
  const [registerError, setRegisterError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, isValid, errors }
  } = useForm<LoginBodyType>({
    defaultValues,
    mode: "onChange"
  });

  const registerUser = useCallback(
    async (data: LoginBodyType) => {
      setRegisterError(null);
      try {
        await postData("/auth/register", data);
        reset(defaultValues);
        push("/auth/login");
      } catch (error) {
        const errorsFromServer = (error as ApiErrorResponseType)?.response?.data
          ?.error;
        if (errorsFromServer) {
          const errorsFromServerKeys = Object.keys(errorsFromServer);
          errorsFromServerKeys.forEach((key, index) => {
            setError(
              key,
              { message: errorsFromServer[key], type: "validate" },
              { shouldFocus: index === 0 }
            );
          });
        }
        setRegisterError(
          constructErrorMessage(
            error as ApiErrorResponseType,
            "Unknown error occurred whilst login in!"
          )
        );
      }
    },
    [push, reset]
  );
  return (
    <AuthLayout className="md:min-h-full flex flex-col items-center justify-center p-10">
      <div className="md:max-w-[27rem] w-full flex flex-col gap-6">
        {registerError && (
          <div className="bg-red-100 rounded-md p-3 px-5 flex items-center justify-between">
            <p className="text-red-500">{registerError}</p>
            <button
              onClick={() => {
                setRegisterError(null);
              }}
              title="close error"
              className="text-red-600"
            >
              <MdCancel />
            </button>
          </div>
        )}
        <h1 className="text-2xl font-bold">Sign up</h1>
        <InputField
          label="Name"
          placeholder="Full name"
          error={errors?.name?.message}
          {...register("name", {
            required: "Please provide your name"
          })}
        />
        <InputField
          label="Email"
          placeholder="Email address"
          type="email"
          error={errors?.email?.message}
          {...register("email", {
            required: "Please provide your email"
          })}
        />
        <InputField
          label="Password"
          type="password"
          placeholder="Password here..."
          error={errors?.password?.message}
          {...register("password", {
            required: "Please provide your password"
          })}
        />
        <InputField
          label="Repeat password"
          type="password"
          placeholder="Repeat your password"
          error={errors?.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "Please repeat your password"
          })}
        />
        <p className="font-bold opacity-60">
          By continuing, you agree to our terms and condition
        </p>
        <Button
          buttonType="primary-dark"
          loading={isSubmitting}
          disabled={!isValid}
          onClick={handleSubmit(registerUser)}
        >
          Register
        </Button>
        <div className="text-center">
          <p>
            Already have an account?{" "}
            <Link href={"/auth/login"} className="underline font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;
