import express, { Application, Router } from "express";
import mongoose from 'mongoose';
import expressConfig from "./frameworks/webserver/express";
import config from "./config";
import connection from "./frameworks/database/mongodb/connection";
import serverConfig from "./frameworks/webserver/server";
import routes from "./presentation/routes/routes";
import errorHandlingMiddleware from "./presentation/middleware/errorHandling";

import http, { Server as httpServerType } from 'http';
import { Server } from "socket.io";

import ioMiddleware from "./presentation/middleware/ioMiddleware";
import { SocketService } from "./services/socketService";
import { UserController } from "./presentation/controllers/userController";
import { AuthRepository } from "./frameworks/database/mongodb/repository/authRepository";
import { NotoficationService } from "./services/NotificationService";
import { NotificationRepository } from "./frameworks/database/mongodb/repository/NotiFicationRepo";
import { VideoRepository } from "./frameworks/database/mongodb/repository/VideoRepository";
import { VideoNotiService } from "./services/VideoNotiService";
import { Mailer } from "./External- Libraries/mailer";
import cors from 'cors'

const app: Application = express();
const router: Router = express.Router()





const userRepo=new AuthRepository()

const notificationRepo=new NotificationRepository()

const notificationService=new NotoficationService(notificationRepo)

const videoRepository=new VideoRepository()

const videoNotiService=new VideoNotiService(videoRepository)

const mailer=new Mailer()

const socketService=new SocketService(userRepo,notificationService,videoNotiService,mailer)


expressConfig(app,config)

routes(app,router)

connection(mongoose,config).connectToMongo()

app.use(errorHandlingMiddleware)

const httpServer:httpServerType = http.createServer(app);



const io = new Server(httpServer, {
  transports:['polling'],
  cors: {
    origin: [ 'https://www.phaseex.live', "https://phaseex.live",'http://localhost:3000','http://localhost:5173','http://localhost:5174'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }
  
});




app.use(ioMiddleware(io));

io.on("connection", socket => {
  console.log('New client connected');
  socket.on("disconnect", () => {
  });
  socketService.handleConnection(socket)
  
});




serverConfig(httpServer,config).startServer()