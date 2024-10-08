import dotenv from 'dotenv';
import path from 'path';

let envFilePath = '../../.env';

if (process.env.APP_ENV && process.env.APP_ENV == 'test') {
  envFilePath = '../../.env.test';
}

dotenv.config({ path: path.resolve(__dirname, envFilePath) });

interface ServerConfig {
  AWSDynamoDBAccessKey: string
  AWSDynamoDBAccessSecret: string
  AWSDynamoDBEndpoint: string
  AWSDynamoDBRegion: string
  JWTSecretKey: string
  LogLevel: string
  Port: number
}

const serverConfig: ServerConfig = {
  AWSDynamoDBAccessKey: process.env.AWS_DYNAMO_DB_ACCESS_KEY || '',
  AWSDynamoDBAccessSecret: process.env.AWS_DYNAMO_DB_ACCESS_SECRET || '',
  AWSDynamoDBEndpoint: process.env.AWS_DYNAMO_DB_ENDPOINT || '',
  AWSDynamoDBRegion: process.env.AWS_DYNAMO_DB_REGION || '',
  JWTSecretKey: process.env.JWT_SECRET_KEY || '',
  LogLevel: process.env.LOG_LEVEL || 'info',
  Port: parseInt(process.env.PORT || '3000', 10)
};

export default serverConfig;


