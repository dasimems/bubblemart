import { IconProps } from "iconsax-react";
import { IconNode } from "lucide-react";
import { HTMLProps } from "react";
import { IconBaseProps } from "react-icons";

declare global {
  type IconType = React.FC<IconProps | IconBaseProps> | IconNode;

  type LabelProps = {
    children: React.ReactNode;
  } & HTMLProps<HTMLLabelElement>;

  type InputElementProps = {
    label?: React.ReactNode;
    inputClassName?: string;
    inputParentClassName?: string;
    formClassName?: string;
    labelClassName?: string;
    error?: string;
  } & HTMLProps<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

  type InputFieldProps = {
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

  type SelectOptionType = {
    value: string;
    label: string;
  };

  type SelectBoxType = {
    options?: SelectOptionType[];
    emptyOptionLabel?: string;
    hideEmptyOption?: boolean;
  } & InputElementProps;
}

export {};
