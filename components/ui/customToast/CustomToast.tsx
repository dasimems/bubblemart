import React from "react";
import { ToastContainer, Slide } from "react-toastify";
import styles from "./CustomToast.module.css";

const CustomToast: React.FC = () => {
  return (
    <ToastContainer
      position="top-center"
      autoClose={3000}
      newestOnTop
      limit={1}
      hideProgressBar
      closeOnClick
      pauseOnHover
      draggable
      icon={false}
      closeButton={false}
      transition={Slide}
      // className={styles.Toastify__toast_container}
      // toastClassName={styles.Toastify__toast}
      // bodyClassName={styles.Toastify__toast_body}
    />
  );
};

export default CustomToast;
