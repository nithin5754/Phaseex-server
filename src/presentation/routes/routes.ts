import { Application, Router } from "express";
import authRouter from "./authRouter";
import homeRouter from "./homeRoutes";
import userRouter from "./userRoutes";


export const routes = (app: Application, router: Router) => {

  app.use('/api/v1/auth', authRouter(router));
  app.use('/api/v1/auth',userRouter(router))
  app.use('/api/v1/home', homeRouter(router));
  
};

export default routes