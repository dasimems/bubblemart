import { create } from "zustand";
import { OrderDetailsType } from "./useOrderStore";

export type Roles = "USER" | "ADMIN";

export type UserDetailsType = {
  email: string;
  name: string;
  role?: Roles;
  createdAt?: Date;
  updatedAt?: Date;
  avatar?: string;
  id: string;
  totalCarts?: number;
  totalOrders?: number;
  totalCompletedOrders?: number;
  lastMadeOrder?: OrderDetailsType;
};

type UserStoreType = {
  userDetails: UserDetailsType | null;
  userToken: string | null;
  fetchingUserDetailsError: string | null;
  setUserDetails: (details: UserDetailsType) => void;
  setUserToken: (token: string) => void;
  setFetchingUserDetailsError: (error: string) => void;
  clearStore: () => void;
};

const initialValue = {
  userDetails: null,
  userToken: null,
  fetchingUserDetailsError: null
};

const useUserStore = create<UserStoreType>((set) => ({
  ...initialValue,
  setUserDetails: (userDetails) => {
    set({ userDetails, fetchingUserDetailsError: null });
  },
  setUserToken: (userToken) => {
    set({ userToken });
  },
  setFetchingUserDetailsError: (fetchingUserDetailsError) => {
    set({ fetchingUserDetailsError });
  },
  clearStore: () => {
    set(initialValue);
  }
}));

export default useUserStore;
