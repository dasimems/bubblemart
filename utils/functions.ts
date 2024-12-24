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
