import { setHeaderAuthorization } from "@/api";
import { deleteSavedToken, getSavedToken, saveToken } from "@/localservices";
import useUserStore from "@/store/useUserStore";
import { useCallback } from "react";
import useUser from "./useUser";
import useCart from "./useCart";

const useAuth = () => {
  const { setUserToken } = useUserStore();
  const { getUserDetails } = useUser();
  const { getCart } = useCart();

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
        getCart();
      } catch (error) {
        // perform any preaction operations
      }
    },
    [setUserToken, getUserDetails, getCart]
  );

  const loadApp = useCallback(async () => {
    try {
      const token = getSavedToken();
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
