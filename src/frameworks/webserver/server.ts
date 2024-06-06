import { Application } from 'express';
import { ConfigType } from '../../config';

import  { Server as httpServerType } from 'http';


const serverConfig = (httpServer: httpServerType, config: ConfigType) => {
  const startServer = () => {
    httpServer.listen(config.port, () => {
          console.log(`Server listening on Port ${config.port}`);
      });
  };
  return { startServer };
}


export default serverConfig;