import { getData, setHeaderAuthorization } from "@/api";
import useUserStore, { UserDetailsType } from "@/store/useUserStore";
import { constructErrorMessage } from "@/utils/functions";
import { useCallback } from "react";
import useAuth from "./useAuth";
import { deleteSavedToken } from "@/localservices";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { toastIds } from "@/utils/variables";

const useUser = () => {
  const {
    setFetchingUserDetailsError,
    setUserDetails,
    clearStore,
    ...details
  } = useUserStore();
  const { push } = useRouter();

  const logoutUser = useCallback(
    (isUnauthorized = false) => {
      try {
        push("/");
        setTimeout(() => {
          setHeaderAuthorization();
          clearStore();
          deleteSavedToken();
          if (isUnauthorized) {
            return toast.error("Please login again!", {
              toastId: toastIds.login
            });
          }
          toast.success("Logged out successfully!", {
            toastId: toastIds.login
          });
        }, 100);
      } catch (error) {
        // perform any preaction operations
      }
    },
    [clearStore, push]
  );

  const validateError = useCallback(
    (error: ApiErrorResponseType) => {
      if (error?.status === 401) {
        logoutUser(true);
      }
    },
    [logoutUser]
  );

  const getUserDetails = useCallback(async () => {
    try {
      const { data } = await getData<ApiCallResponseType<UserDetailsType>>(
        "/user"
      );
      const { data: userDetails } = data;
      setUserDetails(userDetails);
    } catch (error) {
      validateError(error as ApiErrorResponseType);
      setFetchingUserDetailsError(
        constructErrorMessage(
          error as ApiErrorResponseType,
          "Unknown error occurred whilst fetching user details"
        )
      );
    }
  }, [setFetchingUserDetailsError, setUserDetails, validateError]);

  return { getUserDetails, logoutUser, ...details };
};

export default useUser;
