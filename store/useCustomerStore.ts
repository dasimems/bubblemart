import { create } from "zustand";
import { CartDetailsType } from "./useCartStore";
import { UserDetailsType } from "./useUserStore";

type OrderStoreType = {
  customers: UserDetailsType[] | null;
  fetchingCustomersError: string | null;
  isLoadingNextCustomers: boolean;

  setCustomers: (order: UserDetailsType[]) => void;
  setFetchingCustomersError: (error?: string | null) => void;
  isFetchingNextCustomer: () => void;
};

const initialValue = {
  customers: null,
  fetchingCustomersError: null,
  isLoadingNextCustomers: false,
};

const useCustomerStore = create<OrderStoreType>((set) => ({
  ...initialValue,
  setCustomers: (customers) => {
    set({
      customers,
      isLoadingNextCustomers: false,
      fetchingCustomersError: null,
    });
  },
  setFetchingCustomersError: (fetchingCustomersError = null) => {
    set({
      fetchingCustomersError,
      isLoadingNextCustomers: false,
    });
  },
  isFetchingNextCustomer: () => {
    set({
      isLoadingNextCustomers: true,
      fetchingCustomersError: null,
    });
  },
}));

export default useCustomerStore;
