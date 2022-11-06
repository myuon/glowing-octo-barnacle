import { Repository } from "typeorm";
import { TransactionStatementEventTable } from "../db/transactionStatementEvent";

export interface App {
  transactionStatementEventRepository: Repository<TransactionStatementEventTable>;
}
