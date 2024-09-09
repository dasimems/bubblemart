import React, { forwardRef } from "react";
import Label from "./Label";

const RadioButton = forwardRef<HTMLInputElement, InputElementProps>(
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
              id={id || label || "input-rad"}
              ref={ref}
              type="radio"
              className={`${inputClassName} peer/radio-btn  opacity-0 z-10 w-full h-full`}
            />
            <div className="absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 w-full h-full flex items-center after:w-[70%] after:h-[70%] after:border-black after:border after:rounded-full peer-checked/radio-btn:after:bg-black justify-center border-black border rounded-full" />
          </div>
          {label && (
            <Label
              className={`${labelClassName}`}
              htmlFor={id || label || "input-rad"}
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

RadioButton.displayName = "Radio Button";

export default RadioButton;
