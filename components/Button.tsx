import React from "react";

const Button: React.FC<
  {
    type?: "button" | "submit" | "reset";
    buttonType?:
      | "primary"
      | "secondary"
      | "black"
      | "white"
      | "default"
      | "primary-dark";
    size?: "medium" | "large" | "small";
    loading?: boolean;
    disabled?: boolean;
    className?: string;
    children: React.ReactNode;
    buttonTitle?: string;
    isSpecial?: boolean;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({
  type,
  buttonType,
  size,
  loading,
  disabled,
  className,
  children,
  buttonTitle,
  isSpecial,
  ...props
}) => {
  let buttonStyleClassName = "bg-slate-200";
  const buttonSizeClassName = "text-base";

  switch (buttonType) {
    case "black":
      buttonStyleClassName = "bg-black text-white";
      break;
    case "primary":
      buttonStyleClassName = "bg-[#5BC4BE]";
    case "primary-dark":
      buttonStyleClassName = "bg-primary text-white";
      break;
    case "secondary":
      buttonStyleClassName = "bg-secondary";
      break;
    case "white":
      buttonStyleClassName = "bg-white";
      break;
    default:
      break;
  }
  switch (size) {
    case "large":
      buttonStyleClassName = "text-lg";
      break;
    case "small":
      buttonStyleClassName = "text-sm";
      break;
    default:
      break;
  }
  return (
    <button
      aria-label={buttonTitle ?? "mems system"}
      disabled={loading || disabled}
      type={type}
      className={`${buttonStyleClassName} ${buttonSizeClassName} disabled:!cursor-not-allowed disabled:bg-[#C0C0C0] rounded-2xl py-3 px-5 ${
        isSpecial ? "rounded-tl-none rounded-bl-3xl" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
