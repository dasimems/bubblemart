import { IconProps } from "iconsax-react";
import { IconNode } from "lucide-react";
import React, { HTMLProps } from "react";
import { IconBaseProps } from "react-icons";

declare global {
  export type IconType = React.FC<IconProps | IconBaseProps> | IconNode;

  export type LabelProps = {
    children: React.ReactNode;
  } & HTMLProps<HTMLLabelElement>;

  export type InputElementProps = {
    label?: React.ReactNode;
    inputClassName?: string;
    inputParentClassName?: string;
    formClassName?: string;
    labelClassName?: string;
    error?: string;
  } & HTMLProps<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

  export type InputFieldProps = {
    buttonTitle?: string;
    rightIcon?: React.ReactNode;
    leftIcon?: React.ReactNode;
    rightButtonTitle?: string;
    leftButtonClassName?: string;
    rightButtonClassName?: string;
    leftButtonTitle?: string;
    rightIconAction?: () => void;
    leftIconAction?: () => void;
    iconProps?: IconProps;
  } & InputElementProps;

  export type SelectOptionType = {
    value: string;
    label: string;
  };

  export type SelectBoxType = {
    options?: SelectOptionType[];
    emptyOptionLabel?: string;
    hideEmptyOption?: boolean;
  } & InputElementProps;
}

export {};
