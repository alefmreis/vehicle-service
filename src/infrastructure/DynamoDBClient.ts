import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

function NewDynamoDB(dbEndpoint: string, dbRegion: string, dbAccessKey: string, dbSecretAccessKey: string): DynamoDBClient {
  return new DynamoDBClient({
    region: dbRegion,
    endpoint: dbEndpoint,
    credentials: {
      accessKeyId: dbAccessKey,
      secretAccessKey: dbSecretAccessKey
    }
  });
}

export default NewDynamoDB;