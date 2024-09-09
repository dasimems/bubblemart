import React, { forwardRef } from "react";
import Label from "./Label";

const CheckBox = forwardRef<HTMLInputElement, InputElementProps>(
  (
    {
      label,
      id,
      className,
      inputClassName,
      inputParentClassName,
      formClassName,
      labelClassName,
      error,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`${className} flex flex-col gap-2`}>
        <div className={`${formClassName} flex gap-3 items-center`}>
          <div
            className={`${inputParentClassName} w-[1rem] relative h-[1rem] flex items-center justify-center`}
          >
            <input
              {...props}
              title={label}
              id={id || label || "input-check"}
              ref={ref}
              type="checkbox"
              className={`${inputClassName} peer/check-btn  opacity-0 z-10 w-full h-full`}
            />
            <div className="absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 w-full h-full flex items-center after:w-[70%] after:h-[70%] after:border-primary peer-checked/check-btn:after:border peer-checked/check-btn:after:bg-primary justify-center border-primary border rounded-[0.2rem]" />
          </div>

          {label && (
            <Label
              className={`${labelClassName}`}
              htmlFor={id || label || "input-check"}
            >
              {label}
            </Label>
          )}
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>
    );
  }
);

CheckBox.displayName = "Check Box";

export default CheckBox;
