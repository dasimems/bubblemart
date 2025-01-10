import { create } from "zustand";

export type ProductType = "log" | "gift";

export type ProductDetailsType = {
  id: string;
  name: string;
  type: ProductType;
  quantity: number;
  amount: AmountType;
  image: string;
  description: string;
};

export type ProductStoreType = {
  giftProducts: ProductDetailsType[] | null;
  fetchingGiftProductsError: string | null;
  isNextGiftProductLoading: boolean;
  setGiftProducts: (product: ProductDetailsType[] | null) => void;
  setFetchingGiftProductsError: (error?: string | null) => void;
  isLoadingNextGiftProducts: () => void;

  logProducts: ProductDetailsType[] | null;
  fetchingLogProductsError: string | null;
  isNextLogProductLoading: boolean;
  setLogProducts: (product: ProductDetailsType[] | null) => void;
  setFetchingLogProductsError: (error?: string | null) => void;
  isLoadingNextLogProducts: () => void;
};

const initialValues = {
  giftProducts: null,
  logProducts: null,
  fetchingGiftProductsError: null,
  fetchingLogProductsError: null,
  isNextGiftProductLoading: false,
  isNextLogProductLoading: false
};

const useProductStore = create<ProductStoreType>((set) => ({
  ...initialValues,

  setGiftProducts: (giftProducts) => {
    set({ giftProducts, isNextGiftProductLoading: false });
  },
  setFetchingGiftProductsError: (fetchingGiftProductsError = null) => {
    set({ fetchingGiftProductsError, isNextGiftProductLoading: false });
  },
  isLoadingNextGiftProducts: () => {
    set({ isNextLogProductLoading: true });
  },

  setLogProducts: (logProducts) => {
    set({ logProducts, isNextLogProductLoading: false });
  },
  setFetchingLogProductsError: (fetchingLogProductsError = null) => {
    set({ fetchingLogProductsError, isNextLogProductLoading: false });
  },
  isLoadingNextLogProducts: () => {
    set({ isNextLogProductLoading: true });
  }
}));

export default useProductStore;
