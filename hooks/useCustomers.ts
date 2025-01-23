import { getData } from "@/api";
import useCustomerStore from "@/store/useCustomerStore";
import { UserDetailsType } from "@/store/useUserStore";
import { constructErrorMessage } from "@/utils/functions";
import { useCallback } from "react";

const useCustomers = () => {
  const { setCustomers, setFetchingCustomersError, ...details } =
    useCustomerStore();
  const getCustomers = useCallback(async () => {
    setFetchingCustomersError();
    try {
      const { data } = await getData<ApiCallResponseType<UserDetailsType[]>>(
        "/users"
      );
      const { data: content } = data;
      setCustomers(content);
    } catch (error) {
      setFetchingCustomersError(
        constructErrorMessage(
          error as ApiErrorResponseType,
          "Unknown error occurred whilst fetching users!"
        )
      );
    }
  }, [setCustomers, setFetchingCustomersError]);
  return { getCustomers, ...details };
};

export default useCustomers;
