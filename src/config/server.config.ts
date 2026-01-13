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
  CORSAllowedOrigins: string[]
  JWTSecretKey: string
  LogLevel: string
  Port: number
}

const jwtSecretKey = process.env.JWT_SECRET_KEY || '';

// Validate JWT secret key strength
if (!jwtSecretKey) {
  throw new Error('JWT_SECRET_KEY is required in environment variables');
}

if (jwtSecretKey.length < 32) {
  throw new Error('JWT_SECRET_KEY must be at least 32 characters long for security');
}

// Parse CORS allowed origins from environment
const corsOriginsEnv = process.env.CORS_ALLOWED_ORIGINS || '*';
const corsOrigins = corsOriginsEnv === '*' ? ['*'] : corsOriginsEnv.split(',').map(origin => origin.trim());

const serverConfig: ServerConfig = {
  AWSDynamoDBAccessKey: process.env.AWS_DYNAMO_DB_ACCESS_KEY || '',
  AWSDynamoDBAccessSecret: process.env.AWS_DYNAMO_DB_ACCESS_SECRET || '',
  AWSDynamoDBEndpoint: process.env.AWS_DYNAMO_DB_ENDPOINT || '',
  AWSDynamoDBRegion: process.env.AWS_DYNAMO_DB_REGION || '',
  CORSAllowedOrigins: corsOrigins,
  JWTSecretKey: jwtSecretKey,
  LogLevel: process.env.LOG_LEVEL || 'info',
  Port: parseInt(process.env.PORT || '3000', 10)
};

export default serverConfig;


