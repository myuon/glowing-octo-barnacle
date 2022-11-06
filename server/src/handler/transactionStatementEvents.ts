import dayjs from "dayjs";
import { Context } from "koa";
import { Between } from "typeorm";
import { z } from "zod";
import { schemaForType } from "../helper/zod";
import { TransactionStatementEvent } from "../model/transactionStatementEvent";
import { App } from "./app";

export const transactionStatementEventSaveAll = async (
  app: App,
  ctx: Context
) => {
  const inputSchema = schemaForType<
    Omit<TransactionStatementEvent, "createdAt">[]
  >()(
    z.array(
      z.object({
        uniqueKey: z.string(),
        title: z.string(),
        dividedCount: z.number(),
        dividedIndex: z.number(),
        type: z.enum(["income", "expense"]),
        amount: z.number(),
        description: z.string(),
        transactionDate: z.string(),
      })
    )
  );
  const result = inputSchema.safeParse(ctx.request.body);
  if (!result.success) {
    ctx.throw(400, "Bad Request", result.error);
  }

  const input = result.data.map((r) => ({
    ...r,
    createdAt: dayjs().unix(),
  }));
  await app.transactionStatementEventRepository.save(input);
  ctx.body = "OK";
};

export const transactionStatementEventSearch = async (
  app: App,
  ctx: Context
) => {
  const input = ctx.request.body as {
    transactionDateSpan: { start: string; end: string };
  };
  const result = await app.transactionStatementEventRepository.findMany({
    where: {
      transactionDate: Between(
        input.transactionDateSpan.start,
        input.transactionDateSpan.end
      ),
    },
  });
  ctx.body = result;
};
