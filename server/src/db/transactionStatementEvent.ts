import {
  Column,
  Entity,
  FindManyOptions,
  PrimaryColumn,
  Repository,
} from "typeorm";
import {
  TransactionStatementEvent,
  TransactionStatementType,
} from "../../../shared/transactionStatementEvent";

@Entity()
export class TransactionStatementEventTable {
  @PrimaryColumn({
    length: 200,
  })
  uniqueKey: string;

  @Column()
  title: string;

  @Column()
  dividedCount: number;

  @Column()
  dividedIndex: number;

  @Column()
  type: string;

  @Column()
  amount: number;

  @Column()
  description: string;

  @Column()
  transactionDate: string;

  @Column()
  createdAt: number;

  @Column({ nullable: true, type: "varchar" })
  parentKey: string | null;

  static fromTransactionStatementEvent(
    model: TransactionStatementEvent
  ): TransactionStatementEventTable {
    const record = new TransactionStatementEventTable();
    record.uniqueKey = model.uniqueKey;
    record.title = model.title;
    record.dividedCount = model.dividedCount;
    record.dividedIndex = model.dividedIndex;
    record.type = model.type;
    record.amount = model.amount;
    record.description = model.description;
    record.transactionDate = model.transactionDate;
    record.createdAt = model.createdAt;
    record.parentKey = model.parentKey ?? null;

    return record;
  }

  toTransactionStatementEvent(): TransactionStatementEvent {
    return {
      uniqueKey: this.uniqueKey,
      title: this.title,
      dividedCount: this.dividedCount,
      dividedIndex: this.dividedIndex,
      type: this.type as TransactionStatementType,
      amount: this.amount,
      description: this.description,
      createdAt: this.createdAt,
      transactionDate: this.transactionDate,
      parentKey: this.parentKey ?? undefined,
    };
  }
}

export const newTransactionStatementEventRepository = (
  repo: Repository<TransactionStatementEventTable>
) => {
  return {
    save: async (models: TransactionStatementEvent[]) => {
      return await repo.save(
        models.map(TransactionStatementEventTable.fromTransactionStatementEvent)
      );
    },
    findMany: async (
      options: FindManyOptions<TransactionStatementEventTable>
    ) => {
      const result = await repo.find(options);

      return result.map((r) => r.toTransactionStatementEvent());
    },
  };
};

export type TransactionStatementEventRepository = ReturnType<
  typeof newTransactionStatementEventRepository
>;
