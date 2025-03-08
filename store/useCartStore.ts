import { create } from "zustand";
import { ProductDetailsType, ProductType } from "./useProductStore";

export type CartBodyType = {
  senderName: string;
  receiverName: string;
  receiverAddress: string;
  receiverPhoneNumber: string;
  shortNote: string;
  longitude: number;
  latitude: number;
};

export type CartProductDetails = {
  id: string;
  image: string;
  name: string;
  amount: AmountType;
  type: ProductType;
  description: string;
} & ProductDetailsType;

export type CartDetailsType = {
  productDetails: CartProductDetails;
  id: string;
  totalPrice: AmountType;
  isAvailable?: boolean;
  quantity: number;
  deliveredAt?: Date;
  paidAt?: Date;
  createdAt?: Date;
};

const removeDuplicateCarts = (
  cartArray: CartDetailsType[]
): CartDetailsType[] => {
  // Create a map to track the highest quantity cart for each product ID
  const cartMap: { [id: string]: CartDetailsType } = {};

  // Loop through each cart item
  for (const cart of cartArray) {
    // Check if the product ID is already in the map
    if (cartMap[cart.id]) {
      // If it's already there, compare the quantities
      if (cart.quantity > cartMap[cart.id].quantity) {
        // Keep the one with the higher quantity
        cartMap[cart.id] = cart;
      }
    } else {
      // If it's not in the map, add the item
      cartMap[cart.id] = cart;
    }
  }

  // Return the values of the cartMap, which now contains only unique cart items with the highest quantity
  return Object.values(cartMap);
};
export type CartStoreType = {
  carts: CartDetailsType[] | null;
  cartFetchingError: string | null;
  isNextCartLoading: boolean;
  doCartNeedAddress: boolean;

  setCarts: (carts: CartDetailsType[]) => void;
  setCartFetchingError: (error?: string | null) => void;
  isFetchingNextCart: () => void;
  setCartNeedAddress: (needed: boolean) => void;

  updateCart: (cart: CartDetailsType) => void;
  clearCart: () => void;
};

const initialValue = {
  carts: null,
  cartFetchingError: null,
  isNextCartLoading: false,
  doCartNeedAddress: false
};

const useCartStore = create<CartStoreType>((set) => ({
  ...initialValue,
  setCarts: (carts) => {
    set((prevState) => {
      const allCart = [...(prevState.carts || []), ...carts];
      const giftTypeCart = carts?.find(
        (cart) => cart?.productDetails?.type === "gift"
      );
      return {
        ...prevState,
        carts: removeDuplicateCarts(allCart),
        isNextCartLoading: false,
        cartFetchingError: null,
        doCartNeedAddress: !!giftTypeCart
      };
    });
  },
  setCartFetchingError: (cartFetchingError = null) => {
    set({ cartFetchingError, isNextCartLoading: false });
  },
  isFetchingNextCart: () => {
    set({ isNextCartLoading: true, cartFetchingError: null });
  },
  setCartNeedAddress: (doCartNeedAddress) => {
    set({
      doCartNeedAddress
    });
  },
  updateCart: (cart) => {
    set((prevState) => {
      const previousCarts = prevState.carts;
      let carts: CartDetailsType[] = [];
      if (previousCarts) {
        const cartExist = !!previousCarts.find(
          (savedCart) => savedCart?.id === cart?.id
        );

        if (cartExist) {
          carts = previousCarts?.map((savedCart) =>
            savedCart?.id === cart?.id ? cart : savedCart
          );
        }
        if (!cartExist) {
          carts = [...previousCarts, cart];
        }
      }

      if (!previousCarts) {
        carts = [cart];
      }
      const giftTypeCart = carts?.find(
        (cart) => cart?.productDetails?.type === "gift"
      );
      return {
        ...prevState,
        carts: removeDuplicateCarts(carts),
        doCartNeedAddress: !!giftTypeCart
      };
    });
  },
  clearCart: () => {
    set({
      carts: null,
      cartFetchingError: null,
      isNextCartLoading: false
    });
  }
}));

export default useCartStore;
