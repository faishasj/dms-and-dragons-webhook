import {
  Params,
  ParamsDictionary,
  Request,
  Response,
  NextFunction as NextFn,
  RequestHandler,
  ErrorRequestHandler,
} from 'express-serve-static-core';

export function asyncUtil<
  P extends Params = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
>(handler: RequestHandler<P, ResBody, ReqBody>) {
  return (req: Request<P, ResBody, ReqBody>, res: Response<ResBody>, next: NextFn) => {
    try {
      return Promise.resolve(handler(req, res, next));
    } catch (e) { return next(e); }
  };
}

export function asyncErrorUtil<
  P extends Params = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
>(handler: ErrorRequestHandler<P, ResBody, ReqBody>) {
  return (error: any, req: Request<P, ResBody, ReqBody>, res: Response<ResBody>, next: NextFn) => {
    try {
      return Promise.resolve(handler(error, req, res, next));
    } catch (e) { return next(e); }
  };
}

const asyncWrapper = asyncUtil;
export default asyncWrapper;
