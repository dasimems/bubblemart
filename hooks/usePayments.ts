import { getData } from "@/api";
import usePaymentsStore from "@/store/usePaymentsStore";
import { UserDetailsType } from "@/store/useUserStore";
import { constructErrorMessage } from "@/utils/functions";
import { useCallback } from "react";

const usePayments = () => {
  const { setPayments, setFetchingPaymentsError, ...details } =
    usePaymentsStore();
  const getPayments = useCallback(async () => {
    setFetchingPaymentsError();
    try {
      const { data } = await getData<ApiCallResponseType<UserDetailsType[]>>(
        "/payments"
      );
      const { data: content } = data;
      setPayments(content);
    } catch (error) {
      setFetchingPaymentsError(
        constructErrorMessage(
          error as ApiErrorResponseType,
          "Unknown error occurred whilst fetching payments!"
        )
      );
    }
  }, [setPayments, setFetchingPaymentsError]);
  return { getPayments, ...details };
};

export default usePayments;
