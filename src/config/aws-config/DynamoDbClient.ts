import { DynamoDB } from 'aws-sdk';
require('dotenv').config();

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;
console.log(AWS_ACCESS_KEY_ID);
console.log(AWS_SECRET_ACCESS_KEY);
const DynamoDbClient: AWS.DynamoDB = new DynamoDB({
  region: 'us-east-1',
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});
const hasTable = async () => {
  const params: AWS.DynamoDB.DescribeTableInput = {
    TableName: 'Users',
  };
  try {
    const table = await DynamoDbClient.describeTable(params).promise();
    if (table.Table.TableStatus === 'ACTIVE') return;
    const _params: AWS.DynamoDB.CreateTableInput = {
      TableName: 'Users',
      KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    };

    DynamoDbClient.createTable(_params, (err) => {
      if (err) console.log(err);
    });
  } catch (err) {
    return false;
  }
};

hasTable().then();

export default DynamoDbClient;
