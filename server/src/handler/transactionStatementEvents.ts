import dayjs from "dayjs";
import { Between, In, IsNull } from "typeorm";
import { z } from "zod";
import { schemaForType } from "../helper/zod";
import { App } from "./app";
import { Context } from "koa";
import {
  TransactionStatementEventCreateRequest,
  TransactionStatementEventSearchRequest,
} from "../../../shared/request/transactionStatementEvent";

export const transactionStatementEventSaveAll = async (
  app: App,
  ctx: Context
) => {
  const inputSchema = schemaForType<TransactionStatementEventCreateRequest>()(
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
        parentKey: z.string().optional(),
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
  const inputSchema = schemaForType<TransactionStatementEventSearchRequest>()(
    z.object({
      transactionDateSpan: z
        .object({
          start: z.string(),
          end: z.string(),
        })
        .optional(),
      amountSpan: z
        .object({
          min: z.number(),
          max: z.number(),
        })
        .optional(),
      parentKeys: z.array(z.string()).optional(),
      onlyNullParentKey: z.boolean().optional(),
    })
  );
  const input = inputSchema.safeParse(ctx.request.body);
  if (!input.success) {
    ctx.throw(400, "Bad Request", input.error);
  }

  const result = await app.transactionStatementEventRepository.findMany({
    where: {
      transactionDate: input.data.transactionDateSpan
        ? Between(
            input.data.transactionDateSpan.start,
            input.data.transactionDateSpan.end
          )
        : undefined,
      parentKey: input.data.onlyNullParentKey
        ? IsNull()
        : input.data.parentKeys
        ? In(input.data.parentKeys)
        : undefined,
      amount: input.data.amountSpan
        ? Between(input.data.amountSpan.min, input.data.amountSpan.max)
        : undefined,
    },
  });
  ctx.body = result;
};

export const transactionStatementEventGet = async (app: App, ctx: Context) => {
  const result = await app.transactionStatementEventRepository.findOne(
    ctx.params.id
  );
  if (!result) {
    ctx.throw(404, "Not Found");
  }
  ctx.body = result;
};
