import express, { Application } from "express";
import morgan from 'morgan'
import cookieSession from 'cookie-session'
import mongoSanitize from 'express-mongo-sanitize'
import helmet from "helmet";
import cookieParser from 'cookie-parser'
import { ConfigType } from "../../config";
import cors from 'cors'



export default function expressConfig(app:Application,config:ConfigType){
  app.use(cors({
    origin: ['http://localhost:3000','http://localhost:5173','http://localhost:5174'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}))

  app.use(morgan('dev'))
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieSession({ signed: false, secure: false }))
  app.use(helmet({ xssFilter: true }))
  app.use(mongoSanitize())
}