import express, { Application, Router } from "express";
import mongoose from 'mongoose';
import expressConfig from "./frameworks/webserver/express";
import config from "./config";
import connection from "./frameworks/database/mongodb/connection";
import serverConfig from "./frameworks/webserver/server";
import routes from "./presentation/routes/routes";
import errorHandlingMiddleware from "./presentation/middleware/errorHandling";




const app: Application = express();
const router: Router = express.Router()


expressConfig(app,config)

routes(app,router)

connection(mongoose,config).connectToMongo()

app.use(errorHandlingMiddleware)
serverConfig(app,config).startServer()