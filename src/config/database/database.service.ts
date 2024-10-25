/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { DynamoDB } from 'aws-sdk';
import DynamoDbClient from '../aws-config/DynamoDbClient';
@Injectable()
export class DatabaseService {
  private readonly dynamoDb: DynamoDB;
  constructor() {
    this.dynamoDb = DynamoDbClient;
  }
  async createTable(params: AWS.DynamoDB.CreateTableInput) {
    try {
      await this.dynamoDb.createTable(params).promise();
    } catch (err) {
      console.log(err);
    }
  }

  async getItems(params: AWS.DynamoDB.ScanInput) {
    try {
      const data = await this.dynamoDb.scan(params).promise();
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  async getItem(params: AWS.DynamoDB.GetItemInput) {
    try {
      const data = await this.dynamoDb.getItem(params).promise();
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  async createItem(params: AWS.DynamoDB.PutItemInput) {
    try {
      await this.dynamoDb.putItem(params).promise();
    } catch (err) {
      console.log(err);
    }
  }
  async deleteItem(params: AWS.DynamoDB.DeleteItemInput) {
    try {
      await this.dynamoDb.deleteItem(params).promise();
    } catch (err) {
      console.log(err);
    }
  }

  async updateItem(params: AWS.DynamoDB.UpdateItemInput) {
    try {
      await this.dynamoDb.updateItem(params).promise();
    } catch (err) {
      console.log(err);
    }
  }
}
