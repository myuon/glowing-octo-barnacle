import "reflect-metadata";
import Koa from "koa";
import serve from "koa-static";
import * as path from "path";
import { DataSource } from "typeorm";
import { TransactionStatementEventTable } from "./db/transactionStatementEvent";
import * as admin from "firebase-admin";
import cors from "@koa/cors";
import koaBody from "koa-body";
import { TransactionStatementEvent } from "./model/transactionStatementEvent";

const dataSource = new DataSource({
  type: "sqlite",
  database: path.join(__dirname, "db.sqlite"),
  entities: [TransactionStatementEventTable],
  logging: true,
  synchronize: true,
});
const transactionStatementEventRepository = dataSource.getRepository(
  TransactionStatementEventTable
);

admin.initializeApp();

const auth = admin.auth();
const app = new Koa();

app.use(cors());
app.use(koaBody());

app.use(async (ctx, next) => {
  const token = ctx.request.header.authorization?.split("Bearer ")?.[1];

  if (token) {
    try {
      const decodedToken = await auth.verifyIdToken(token);
      ctx.state.auth = decodedToken;
    } catch (error) {
      console.error(error);
      ctx.throw("Unauthorized", 401);
    }
  }

  await next();
});

app.use(async (ctx, next) => {
  ctx.status = 200;

  if (ctx.request.path.startsWith("/api")) {
    if (
      ctx.request.method === "POST" &&
      ctx.request.path === "/api/transactionStatementEvents"
    ) {
      const input = ctx.request.body as TransactionStatementEvent[];
      await transactionStatementEventRepository.save(
        input.map(TransactionStatementEventTable.fromTransactionStatementEvent)
      );
    } else if (
      ctx.request.method === "GET" &&
      ctx.request.path === "/api/transactionStatementEvents"
    ) {
      const output = await transactionStatementEventRepository.find();
      ctx.body = output.map((r) => r.toTransactionStatementEvent());
    } else {
      ctx.throw(404, "Path Not found");
    }
  } else {
    if (process.env.NODE_ENV === "production") {
      return serve(path.resolve(__dirname, "web"))(ctx, next);
    }
  }
});

const main = async () => {
  await dataSource.initialize();

  app.listen(3000);
  console.log(`✨ Server running on http://localhost:3000`);
};

main();
