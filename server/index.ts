import "reflect-metadata";
import Koa from "koa";
import * as path from "path";
import { DataSource } from "typeorm";
import {
  newTransactionStatementEventRepository,
  TransactionStatementEventTable,
} from "./src/db/transactionStatementEvent";
import * as admin from "firebase-admin";
import cors from "@koa/cors";
import koaBody from "koa-body";
import Router from "koa-router";
import adminKey from "../.secrets/firebase-admin-key.json";
import { App } from "./src/handler/app";
import {
  transactionStatementEventSaveAll,
  transactionStatementEventSearch,
} from "./src/handler/transactionStatementEvents";
import { authJwt } from "./src/middleware/auth";
import { serveStatic } from "./src/middleware/serve";
import logger from "koa-pino-logger";

const dataSource = new DataSource({
  type: "sqlite",
  database: path.join(__dirname, "db.sqlite"),
  entities: [TransactionStatementEventTable],
  logging: true,
  synchronize: true,
});
const handlerApp: App = {
  transactionStatementEventRepository: newTransactionStatementEventRepository(
    dataSource.getRepository(TransactionStatementEventTable)
  ),
};

admin.initializeApp({
  credential: admin.credential.cert(adminKey as admin.ServiceAccount),
});

const auth = admin.auth();
const app = new Koa();
const router = new Router({
  prefix: "/api",
});

router.post("/transactionStatementEvents", koaBody(), async (ctx) =>
  transactionStatementEventSaveAll(handlerApp, ctx)
);
router.post("/transactionStatementEvents/search", koaBody(), async (ctx) =>
  transactionStatementEventSearch(handlerApp, ctx)
);

app.silent = true;
app.use(logger());
app.use(cors());
app.use(authJwt(auth));
app.use(
  serveStatic({
    path: path.resolve(__dirname, "..", "web"),
    excludePrefix: "/api",
  })
);
app.use(router.routes());
app.use(router.allowedMethods());

const main = async () => {
  await dataSource.initialize();

  app.listen(3000);
  console.log(`✨ Server running on http://localhost:3000`);
};

main();
