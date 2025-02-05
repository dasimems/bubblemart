import { create } from "zustand";
import { OrderDetailsType } from "./useOrderStore";

type OrderStoreType = {
  orders: OrderDetailsType[] | null;
  fetchingOrderError: string | null;
  isLoadingNextOrder: boolean;

  setOrders: (order: OrderDetailsType[]) => void;
  setFetchingOrderError: (error?: string | null) => void;
  isFetchingNextOrder: () => void;
};

const initialValue = {
  orders: null,
  fetchingOrderError: null,
  isLoadingNextOrder: false
};

const useCustomerOrderStore = create<OrderStoreType>((set) => ({
  ...initialValue,
  setOrders: (orders) => {
    set({
      orders,
      isLoadingNextOrder: false,
      fetchingOrderError: null
    });
  },
  setFetchingOrderError: (fetchingOrderError = null) => {
    set({
      fetchingOrderError,
      isLoadingNextOrder: false
    });
  },
  isFetchingNextOrder: () => {
    set({
      isLoadingNextOrder: true,
      fetchingOrderError: null
    });
  }
}));

export default useCustomerOrderStore;
