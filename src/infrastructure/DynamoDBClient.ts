import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

// Valid AWS region format pattern
const AWS_REGION_PATTERN = /^[a-z]{2}-[a-z]+-\d{1}$|^us-gov-[a-z]+-\d{1}$|^cn-[a-z]+-\d{1}$|^local$/;

function NewDynamoDB(dbEndpoint: string, dbRegion: string, dbAccessKey: string, dbSecretAccessKey: string): DynamoDBClient {
  // Validate AWS region parameter to prevent injection attacks
  if (!dbRegion || !AWS_REGION_PATTERN.test(dbRegion)) {
    throw new Error('Invalid AWS region format. Expected format: us-west-2, local, etc.');
  }

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