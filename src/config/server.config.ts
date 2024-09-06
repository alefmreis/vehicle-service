import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface ServerConfig {
  AWSDynamoDBAccessKey: string
  AWSDynamoDBAccessSecret: string
  AWSDynamoDBEndpoint: string
  AWSDynamoDBRegion: string
  JWTSecretKey: string
  LogLevel: string
  Port: number,
  RunInServerlessEnvironment: boolean
}

const serverConfig: ServerConfig = {
  AWSDynamoDBAccessKey: process.env.AWS_DYNAMO_DB_ACCESS_KEY || '',
  AWSDynamoDBAccessSecret: process.env.AWS_DYNAMO_DB_ACCESS_SECRET || '',
  AWSDynamoDBEndpoint: process.env.AWS_DYNAMO_DB_ENDPOINT || '',
  AWSDynamoDBRegion: process.env.AWS_DYNAMO_DB_REGION || '',
  JWTSecretKey: process.env.JWT_SECRET_KEY || '',
  LogLevel: process.env.LOG_LEVEL || 'info',
  Port: parseInt(process.env.PORT || '3000', 10),
  RunInServerlessEnvironment: !!process.env.RunInServerlessEnvironment
};

export default serverConfig;


