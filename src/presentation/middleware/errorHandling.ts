import { Request, Response, NextFunction } from "express";

const errorHandlingMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    const statusCode: number = err.statusCode || 403;
    const message: string = err.message || 'Internal Server Error';
    res.status(statusCode).json({ message });
};

export default errorHandlingMiddleware;