import cookie from 'cookie';
import { Request, Response } from 'express';

export const themeMiddleware = (req: Request, res: Response, next: Function) => {
  req.__CUSTOM_DATA__ = Object.assign(req.__CUSTOM_DATA__ || {}, {
    theme: cookie.parse(req.headers.cookie || '').theme,
  });
  next();
};
