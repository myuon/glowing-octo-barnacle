import "koa";

declare module "koa" {
  interface Request extends Koa.BaseRequest {
    body?: any;
    files?: Files;
  }
}
