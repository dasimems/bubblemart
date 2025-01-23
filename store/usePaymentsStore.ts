import { create } from "zustand";
import { CartDetailsType } from "./useCartStore";

export type PaymentDetailsType = {
  id: string;
};

type OrderStoreType = {
  payments: PaymentDetailsType[] | null;
  fetchingPaymentsError: string | null;
  isLoadingNextPayments: boolean;

  setPayments: (order: PaymentDetailsType[]) => void;
  setFetchingPaymentsError: (error?: string | null) => void;
  isFetchingNextPayments: () => void;
};

const initialValue = {
  payments: null,
  fetchingPaymentsError: null,
  isLoadingNextPayments: false,
};

const usePaymentsStore = create<OrderStoreType>((set) => ({
  ...initialValue,
  setPayments: (payments) => {
    set({
      payments,
      isLoadingNextPayments: false,
      fetchingPaymentsError: null,
    });
  },
  setFetchingPaymentsError: (fetchingPaymentsError = null) => {
    set({
      fetchingPaymentsError,
      isLoadingNextPayments: false,
    });
  },
  isFetchingNextPayments: () => {
    set({
      isLoadingNextPayments: true,
      fetchingPaymentsError: null,
    });
  },
}));

export default usePaymentsStore;
