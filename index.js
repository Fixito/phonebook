import * as config from './utils/config.js';
import * as logger from './utils/logger.js';
import app from './app.js';

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}...`);
});
