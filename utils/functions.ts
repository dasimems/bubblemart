export const convertObjectToArray = <T extends Record<string, any>>(
  data: T
): Array<T[keyof T]> => {
  return Object.values(data);
};

export const constructErrorMessage = (
  error: ApiErrorResponseType,
  defaultMessage: string
) => {
  return error?.response?.data?.message ?? error?.message ?? defaultMessage;
};

export const generateCacheKey = (id: string) => ({
  details: `details-${id}`,
  products: `products-${id}`,
  orders: `orders-${id}`,
  cart: `cart-${id}`,
  payments: `payments-${id}`,
  logs: `logs-${id}`
});
