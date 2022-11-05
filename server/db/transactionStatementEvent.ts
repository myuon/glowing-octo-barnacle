import { Column, Entity, PrimaryColumn } from "typeorm";

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
  createdAt: number;
}
