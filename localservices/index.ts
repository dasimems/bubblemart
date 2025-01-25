export const saveToken = (token: string) => {
  // const encryptedToken = encrypt(token, process.env.NEXT_PUBLIC_TOKEN_ENCRYPTION_KEY ?? "");
  return localStorage.setItem(
    process.env.NEXT_PUBLIC_LOCAL_STORAGE_TOKEN_KEY ?? "",
    token
  );
};

export const getSavedToken = () => {
  const savedToken = localStorage.getItem(
    process.env.NEXT_PUBLIC_LOCAL_STORAGE_TOKEN_KEY ?? ""
  );
  // if (savedToken) {
  //   const decryptedToken = decrypt(savedToken, process.env.NEXT_PUBLIC_TOKEN_ENCRYPTION_KEY ?? "");
  //   if (decryptedToken) {
  //     token = decryptedToken?.toString();
  //   }
  // }
  return savedToken ?? null;
};

export const deleteSavedToken = () => {
  return localStorage.removeItem(
    process.env.NEXT_PUBLIC_LOCAL_STORAGE_TOKEN_KEY ?? ""
  );
};
