import { ProductDetailsType } from "./useProductStore";

export type LogDetailsType = {
  email: string;
  password: string;
  id: string;
  assignedTo: string;
  productId: ProductDetailsType;
};
