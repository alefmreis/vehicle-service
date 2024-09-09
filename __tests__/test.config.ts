interface TestConfig {
  AWSDynamoDBAccessKey: string
  AWSDynamoDBAccessSecret: string
  AWSDynamoDBEndpoint: string
  AWSDynamoDBRegion: string
  JWTSecretKey: string
}

const testConfig: TestConfig = {
  AWSDynamoDBAccessKey: process.env.AWS_DYNAMO_DB_ACCESS_KEY || '',
  AWSDynamoDBAccessSecret: process.env.AWS_DYNAMO_DB_ACCESS_SECRET || '',
  AWSDynamoDBEndpoint: process.env.AWS_DYNAMO_DB_ENDPOINT || '',
  AWSDynamoDBRegion: process.env.AWS_DYNAMO_DB_REGION || '',
  JWTSecretKey: process.env.JWT_SECRET_KEY || '',
};


console.log('TEST CONFIG', testConfig)

export default testConfig;


