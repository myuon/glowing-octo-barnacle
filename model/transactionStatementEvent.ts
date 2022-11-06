export type TransactionStatementType = "income" | "expense";

export interface TransactionStatementEvent {
  uniqueKey: string;
  title: string;
  dividedCount: number;
  dividedIndex: number;
  type: TransactionStatementType;
  amount: number;
  description: string;
  transactionDate: string;
  createdAt: number;
}
