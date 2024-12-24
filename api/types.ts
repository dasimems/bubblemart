import { AxiosError, AxiosResponse } from "axios";

declare global {
  export type FormattedAmountDetailsType = {
    withoutCurrency: string;
    withCurrency: string;
  };

  export type currencyDetailsType = {
    symbol: string;
    name: string;
  };

  export type AmountType = {
    amount: number;
    whole: number;
    currency: currencyDetailsType;
    formatted: FormattedAmountDetailsType;
  };

  export type LinkType = {
    host: string;
    route: string;
    baseUrl: string;
    commonUrl: string;
    link: string;
  };

  export type ResultPaginationType = {
    total: number;
    pageNum: number;
    activePage: number;
    previousLink: LinkType;
    nextLink: LinkType;
  };

  export type ErrorResponseType = {
    message?: string;
    error?: {
      [name: string]: string[];
    };
  };

  export type ApiRequestResponseType<T> = Promise<AxiosResponse<T>>;

  export type ApiErrorResponseType = AxiosError<ErrorResponseType>;
}

export {};
