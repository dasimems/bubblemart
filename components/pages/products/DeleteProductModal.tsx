import { ProductDetailsType } from "@/store/useProductStore";
import React from "react";

type DeleteProductModalType = {
  opened: boolean;
  onClose: () => void;
  productDetails?: ProductDetailsType;
};

const DeleteProductModal: React.FC<DeleteProductModalType> = () => {
  return <div>DeleteProductModal</div>;
};

export default DeleteProductModal;
