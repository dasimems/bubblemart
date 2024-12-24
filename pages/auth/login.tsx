import { postData } from "@/api";
import Button from "@/components/Button";
import InputField from "@/components/general/InputField";
import AuthLayout from "@/components/layouts/AuthLayout";
import { constructErrorMessage } from "@/utils/functions";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { MdCancel } from "react-icons/md";

export type LoginBodyType = {
  email: string;
  password: string;
};

const defaultValues: LoginBodyType = {
  email: "",
  password: ""
};

const Login = () => {
  const [loginError, setLoginError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid, errors }
  } = useForm<LoginBodyType>({
    defaultValues,
    mode: "onChange"
  });

  const loginUser = useCallback(async (data: LoginBodyType) => {
    setLoginError(null);
    try {
      await postData("/auth/login", data);
    } catch (error) {
      setLoginError(
        constructErrorMessage(
          error as ApiErrorResponseType,
          "Unknown error occurred whilst login in!"
        )
      );
    }
  }, []);
  return (
    <AuthLayout className="md:min-h-full flex flex-col items-center justify-center p-10">
      <div className="md:max-w-[27rem] w-full flex flex-col gap-6">
        {loginError && (
          <div className="bg-red-100 rounded-md p-3 px-5 flex items-center justify-between">
            <p className="text-red-500">{loginError}</p>
            <button
              onClick={() => {
                setLoginError(null);
              }}
              title="close error"
              className="text-red-600"
            >
              <MdCancel />
            </button>
          </div>
        )}
        <h1 className="text-2xl font-bold">Welcome Back</h1>
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
        <div className="flex items-center gap-6 w-full justify-between">
          <div></div>
          <Link href="" className="underline text-primary">
            Forgot password
          </Link>
        </div>
        <Button
          buttonType="primary-dark"
          loading={isSubmitting}
          disabled={!isValid}
          onClick={handleSubmit(loginUser)}
        >
          Sign In
        </Button>
        <div className="text-center">
          <p>
            Don&apos;t have an account?{" "}
            <Link href={"/auth/register"} className="underline font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
