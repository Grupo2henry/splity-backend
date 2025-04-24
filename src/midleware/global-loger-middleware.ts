import { Request, Response, NextFunction } from 'express';

export function loggerGlobal(req: Request, res: Response, next: NextFunction) {
  const timestamp = new Date().toLocaleString();
  console.log(
    `Estas ejecutando un método ${req.method} en la ruta ${req.url} y en la fecha y hora ${timestamp}`,
  );
  next();
}
