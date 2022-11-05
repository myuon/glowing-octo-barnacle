import "reflect-metadata";
import Koa from "koa";
import serve from "koa-static";
import * as path from "path";
import { DataSource, In } from "typeorm";
import { TransactionStatementEventTable } from "./db/transactionStatementEvent";
import * as admin from "firebase-admin";
import cors from "@koa/cors";
import koaBody from "koa-body";
import { TransactionStatementEvent } from "./model/transactionStatementEvent";
import Router from "koa-router";
import adminKey from "../.secrets/firebase-admin-key.json";
import dayjs from "dayjs";

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

admin.initializeApp({
  credential: admin.credential.cert(adminKey as admin.ServiceAccount),
});

const auth = admin.auth();
const app = new Koa();
const router = new Router({
  prefix: "/api",
});

app.use(cors());
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

router.post("/transactionStatementEvents", koaBody(), async (ctx) => {
  const input = (ctx.request.body as TransactionStatementEvent[]).map((r) => ({
    ...r,
    createdAt: dayjs().unix(),
  }));
  await transactionStatementEventRepository.save(
    input.map(TransactionStatementEventTable.fromTransactionStatementEvent)
  );
  ctx.body = "OK";
});
router.post("/transactionStatementEvents/search", koaBody(), async (ctx) => {
  const input = ctx.request.body as {
    transactionDateSpan: { start: string; end: string };
  };
  const result = await transactionStatementEventRepository.find({
    where: {
      transactionDate: In([
        input.transactionDateSpan.start,
        input.transactionDateSpan.end,
      ]),
    },
  });
  ctx.body = result.map((r) => r.toTransactionStatementEvent());
});

app.use(async (ctx, next) => {
  if (
    !ctx.request.path.startsWith("/api") &&
    process.env.NODE_ENV === "production"
  ) {
    return serve(path.resolve(__dirname, "web"))(ctx, next);
  } else {
    return next();
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

const main = async () => {
  await dataSource.initialize();

  app.listen(3000);
  console.log(`✨ Server running on http://localhost:3000`);
};

main();
