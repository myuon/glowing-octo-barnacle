import SHA256_ from "crypto-js/sha256";

export const SHA256 = (text: string) => {
  return SHA256_(text).toString();
};
