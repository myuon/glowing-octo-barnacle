import { Middleware } from "koa";
import serve from "koa-static";
import path from "path";

export const serveStatic =
  (options: { path: string; excludePrefix?: string }): Middleware =>
  async (ctx, next) => {
    if (
      (options.excludePrefix
        ? !ctx.request.path.startsWith(options.excludePrefix)
        : false) &&
      process.env.NODE_ENV === "production"
    ) {
      return serve(path.resolve(__dirname, options.path))(ctx, next);
    } else {
      return next();
    }
  };
