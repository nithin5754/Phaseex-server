import { NextFunction, Request, Response } from 'express';
import { rateLimit } from 'express-rate-limit';
import { MiddlewareOptions } from 'mongoose';

interface ResponseOptions {
  statusCode: number;
  message: string;
}
const rateLimitMiddleware = rateLimit({
  windowMs: 60 * 1000,
  max: 5, 
  message: "You have exceeded your 5 requests per minute limit.",
  headers: true,
  handler:(req:Request,res:Response,next:NextFunction,options:ResponseOptions)=>{
     res.status(options.statusCode).send(options.message)
  },
  standardHeaders:true,
  legacyHeaders:false
});


export default rateLimitMiddleware