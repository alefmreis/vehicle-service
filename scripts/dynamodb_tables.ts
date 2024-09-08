/* eslint-disable no-console */
import dotenv from 'dotenv';
import path from 'path';

import { DynamoDB } from 'aws-sdk';

dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

(async () => {
  try {
    const AWS_DYNAMO_DB_ACCESS_KEY = process.env.AWS_DYNAMO_DB_ACCESS_KEY || '';
    const AWS_DYNAMO_DB_ACCESS_SECRET = process.env.AWS_DYNAMO_DB_ACCESS_SECRET || '';
    const AWS_DYNAMO_DB_ENDPOINT = process.env.AWS_DYNAMO_DB_ENDPOINT || '';
    const AWS_DYNAMO_DB_REGION = process.env.AWS_DYNAMO_DB_REGION || '';

    const dynamoDB = new DynamoDB({
      region: AWS_DYNAMO_DB_REGION,
      endpoint: AWS_DYNAMO_DB_ENDPOINT, 
      accessKeyId: AWS_DYNAMO_DB_ACCESS_KEY, 
      secretAccessKey: AWS_DYNAMO_DB_ACCESS_SECRET
    });

    const accountsTableParams: DynamoDB.CreateTableInput = {
      TableName: 'accounts',
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' }
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'email', AttributeType: 'S' }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      },
      GlobalSecondaryIndexes: [
        {
          IndexName: 'email_idx',
          KeySchema: [
            { AttributeName: 'email', KeyType: 'HASH' }
          ],
          Projection: {
            ProjectionType: 'ALL'
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          }
        }
      ]
    };
    await dynamoDB.createTable(accountsTableParams).promise();

    const vehiclesTableParams: DynamoDB.CreateTableInput = {
      TableName: 'vehicle',
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' } // Partition key
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    };
    await dynamoDB.createTable(vehiclesTableParams).promise();    
  } catch (error) {
    console.error(error);
    throw error;
  }
})();
