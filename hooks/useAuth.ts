import { setHeaderAuthorization } from "@/api";
import { deleteSavedToken, getSavedToken, saveToken } from "@/localservices";
import useUserStore from "@/store/useUserStore";
import { useCallback } from "react";
import useUser from "./useUser";

const useAuth = () => {
  const { setUserToken } = useUserStore();
  const { getUserDetails } = useUser();

  const performAuthOperations = useCallback(
    (token: string, shouldNotSaveToken?: boolean) => {
      if (!token) {
        return;
      }

      try {
        setHeaderAuthorization(token);
        setUserToken(token);
        if (!shouldNotSaveToken) {
          saveToken(token);
        }
        getUserDetails();
      } catch (error) {
        // perform any preaction operations
      }
    },
    [setUserToken, getUserDetails]
  );

  const loadApp = useCallback(async () => {
    try {
      const token = await getSavedToken();
      if (token) {
        performAuthOperations(token, false);
      }
    } catch (error) {
      // perform error operation
    }
  }, [performAuthOperations]);

  return { performAuthOperations, loadApp };
};

export default useAuth;
