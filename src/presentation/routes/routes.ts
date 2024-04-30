import { Application, Router } from "express";
import authRouter from "./authRouter";

export const routes = (app: Application, router: Router) => {

  app.use('/api/v1/auth', authRouter(router));
};

export default routes