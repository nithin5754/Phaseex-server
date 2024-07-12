import { Application, Router } from "express";
import authRouter from "./authRouter";
import homeRouter from "./homeRoutes";
import userRouter from "./userRoutes";
import spaceRoutes from "./spaceRoutes";
import folderRoutes from "./folderRoutes";
import listRoutes from "./listRoutes";
import taskRoutes from "./taskRoutes";
import searchRouter from "./searchRoutes";

import notificationRoutes from "./notificationRoutes";
import todoRoutes from "./todoRoutes";
import activityRoutes from "./activityRoutes";
import videoChatRoutes from "./videoChatRoutes";



export const routes = (app: Application, router: Router) => {
  app.use("/api/v1/auth", authRouter(router));
  app.use("/api/v1/auth", userRouter(router));
  app.use("/api/v1/home", homeRouter(router));
  app.use("/api/v1/space", spaceRoutes(router));
  app.use("/api/v1/folder", folderRoutes(router));
  app.use('/api/v1/list',listRoutes(router))
  app.use('/api/v1/task',taskRoutes(router))
  app.use('/api/v1/search',searchRouter(router))
  app.use('/api/v1/notification',notificationRoutes(router))
  app.use('/api/v1/todo',todoRoutes(router))
  app.use('/api/v1/activity',activityRoutes(router))
  app.use('/api/v1/videoChat',videoChatRoutes(router))
};

export default routes;
