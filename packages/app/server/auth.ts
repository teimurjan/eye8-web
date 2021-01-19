import axios from 'axios';
import cookie from 'cookie';
import { Request, Response } from 'express';

export const authMiddleware = async (req: Request, res: Response, next: Function) => {
  const { access_token: accessToken, refresh_token: refreshToken } = cookie.parse(req.headers.cookie || '');
  try {
    const response = await axios.get(`${process.env.SERVER_API_URL}/api/auth/check`, {
      headers: { Authorization: `Bearer ${accessToken}`, Cookie: `refresh_token=${refreshToken}` },
    });

    if (response.headers['set-cookie']) {
      res.setHeader('Set-Cookie', response.headers['set-cookie']);
    }
  } catch (err) {
    console.error(err);
  }
  next();
};
