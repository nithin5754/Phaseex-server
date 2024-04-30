import { Application } from 'express';
import { ConfigType } from '../../config';


const serverConfig = (app: Application, config: ConfigType) => {
  const startServer = () => {
      app.listen(config.port, () => {
          console.log(`Server listening on Port ${config.port}`);
      });
  };
  return { startServer };
}


export default serverConfig;