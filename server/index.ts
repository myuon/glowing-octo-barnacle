import "reflect-metadata";
import Koa from "koa";
import serve from "koa-static";
import * as path from "path";
const app = new Koa();
import { DataSource } from "typeorm";
import { TransactionStatementEventTable } from "./db/transactionStatementEvent";

const dataSource = new DataSource({
  type: "sqlite",
  database: path.join(__dirname, "db.sqlite"),
  entities: [TransactionStatementEventTable],
  logging: true,
  synchronize: true,
});

const main = async () => {
  await dataSource.initialize();

  app.use((ctx, next) => {
    if (ctx.request.path == "/api/hello") {
      ctx.body = "Hello World";
    } else {
      if (process.env.NODE_ENV === "production") {
        return serve(path.resolve(__dirname, "web"))(ctx, next);
      }
    }
  });

  app.listen(3000);
  console.log(`✨ Server running on http://localhost:3000`);
};

main();
