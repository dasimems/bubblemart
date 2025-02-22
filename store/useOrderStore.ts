import { create } from "zustand";
import { CartBodyType, CartDetailsType } from "./useCartStore";

export type OrderStatusType = "PAID" | "PENDING" | "DELIVERED";

export type PaymentDetailsType = {
  authorization_url: string;
  access_code: string;
  reference: string;
};

export type OrderDetailsType = {
  cartItems: CartDetailsType[];
  id: string;
  checkoutDetails: PaymentDetailsType | null;
  paidAt: Date | null;
  deliveredAt: Date | null;
  paymentInitiatedAt: Date | null;
  paymentReference: string | null;
  refundedAt: Date | null;
  contactInformation: CartBodyType;
  status: OrderStatusType;
  paymentMethod?: string;
  createdAt: Date;
};

const removeDuplicateOrders = (
  orderArray: OrderDetailsType[]
): OrderDetailsType[] => {
  // Create a map to track the highest quantity cart for each product ID
  const orderMap: { [id: string]: OrderDetailsType } = {};

  // Loop through each cart item
  for (const order of orderArray) {
    // Check if the product ID is already in the map
    if (!orderMap[order.id]) {
      orderMap[order.id] = order;
    }
  }

  // Return the values of the cartMap, which now contains only unique cart items with the highest quantity
  return Object.values(orderMap);
};

type OrderStoreType = {
  orders: OrderDetailsType[] | null;
  fetchingOrderError: string | null;
  isLoadingNextOrder: boolean;

  setOrders: (order: OrderDetailsType[]) => void;
  setFetchingOrderError: (error?: string | null) => void;
  isFetchingNextOrder: () => void;
  updateOrder: (order: OrderDetailsType) => void;
};

const initialValue = {
  orders: null,
  fetchingOrderError: null,
  isLoadingNextOrder: false
};

const useOrderStore = create<OrderStoreType>((set) => ({
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
  },

  updateOrder: (order) => {
    set((prevState) => {
      const previousOrder = prevState.orders;
      let orders: OrderDetailsType[] = [];
      if (previousOrder) {
        const orderExists = !!previousOrder.find(
          (savedOrder) => savedOrder?.id === order?.id
        );

        if (orderExists) {
          orders = previousOrder?.map((savedOrder) =>
            savedOrder?.id === order?.id ? order : savedOrder
          );
        }
        if (!orderExists) {
          orders = [...previousOrder, order];
        }
      }

      if (!previousOrder) {
        orders = [order];
      }
      return {
        ...prevState,
        orders: removeDuplicateOrders(orders)
      };
    });
  }
}));

export default useOrderStore;
