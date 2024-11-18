/* eslint-disable no-console */
import './config/opentelemetry';
import config from './config/server.config';
import app from './app';

(async () => {
  app.listen(config.Port, () => {
    console.log(`Server is running on port ${config.Port}`);
  });
})();