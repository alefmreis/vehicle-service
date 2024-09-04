/* eslint-disable @typescript-eslint/no-explicit-any */

import jwt from 'jsonwebtoken';
import winston from 'winston';

import { Request, Response, NextFunction } from 'express';


class AuthMiddleware {
  private jwtSecretKey: string;
  private logger: winston.Logger;

  constructor(jwtKey: string, logger: winston.Logger) {
    this.jwtSecretKey = jwtKey;
    this.logger = logger;
  }

  public async authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        this.logger.error('No token provided');
        return res.status(401).json({ message: 'Access denied. No token provided.' });
      }

      const decoded = await jwt.verify(token, this.jwtSecretKey);
      (req as any).user = decoded;

      await next();
    } catch (error) {
      this.logger.error('Error at authentica user', error);

      const err = error as Error;
      return res.status(401).json({ message: `Access denied. ${err.message}` });
    }
  }

  public async isAdmin(req: Request, res: Response, next: NextFunction) {
    const user = (req as any).user as any;

    if (!user || !user.admin) {
      return res.status(403).json({ message: 'Forbbiden.' });
    }

    await next();
  }
}

export = AuthMiddleware;
