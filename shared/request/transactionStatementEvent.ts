import { TransactionStatementEvent } from "../model/transactionStatementEvent";

export interface TransactionStatementEventSearchRequest {
  transactionDateSpan?: { start: string; end: string };
  amountSpan?: { min: number; max: number };
  parentKeys?: string[];
  onlyNullParentKey?: boolean;
}

export type TransactionStatementEventCreateRequest = Omit<
  TransactionStatementEvent,
  "createdAt"
>[];
