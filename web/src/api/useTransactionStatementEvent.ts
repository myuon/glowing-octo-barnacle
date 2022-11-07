import useSWR from "swr";
import { TransactionStatementEvent } from "../../../shared/model/transactionStatementEvent";
import { TransactionStatementEventSearchRequest } from "../../../shared/request/transactionStatementEvent";
import { getAuthToken } from "../components/auth";

export const useTransactionStatementEvent = (
  req?: TransactionStatementEventSearchRequest
) => {
  return useSWR<TransactionStatementEvent[]>(
    req ? ["/api/transactionStatementEvents/search", req] : null,
    async (url: string) => {
      const token = await getAuthToken();
      if (!token) {
        throw new Error("not authenticated");
      }

      const resp = await fetch(url, {
        method: "POST",
        body: JSON.stringify(req),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return resp.json();
    }
  );
};
