import { getData, setHeaderAuthorization } from "@/api";
import useUserStore, { UserDetailsType } from "@/store/useUserStore";
import { constructErrorMessage } from "@/utils/functions";
import { useCallback } from "react";
import useAuth from "./useAuth";
import { deleteSavedToken } from "@/localservices";

const useUser = () => {
  const {
    setFetchingUserDetailsError,
    setUserDetails,
    clearStore,
    ...details
  } = useUserStore();

  const logoutUser = useCallback(() => {
    try {
      setHeaderAuthorization();
      clearStore();
      deleteSavedToken();
    } catch (error) {
      // perform any preaction operations
    }
  }, [clearStore]);

  const validateError = useCallback(
    (error: ApiErrorResponseType) => {
      if (error?.status === 401) {
        logoutUser();
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
