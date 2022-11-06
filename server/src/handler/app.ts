import { TransactionStatementEventRepository } from "../db/transactionStatementEvent";

export interface App {
  transactionStatementEventRepository: TransactionStatementEventRepository;
}
