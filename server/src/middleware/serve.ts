import { Middleware, Next } from "koa";
import serve from "koa-static";
import path from "path";

export const serveStatic =
  (options: {
    path: string;
    excludePrefix?: string;
    fallbackForSpa?: boolean;
  }): Middleware =>
  async (ctx, next) => {
    if (
      (options.excludePrefix
        ? !ctx.request.path.startsWith(options.excludePrefix)
        : false) &&
      process.env.NODE_ENV === "production"
    ) {
      const fallbackNext: Next = async () => {
        return serve(path.resolve(options.path, "index.html"))(ctx, next);
      };

      return serve(options.path, {
        defer: true,
      })(ctx, options.fallbackForSpa ? fallbackNext : next);
    } else {
      return next();
    }
  };
