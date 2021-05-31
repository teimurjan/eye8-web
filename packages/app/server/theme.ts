import cookie from 'cookie';
import { Request, Response } from 'express';

export const themeMiddleware = (req: Request, res: Response, next: Function) => {
  req.__THEME__ = cookie.parse(req.headers.cookie || '').theme;
  next();
};
