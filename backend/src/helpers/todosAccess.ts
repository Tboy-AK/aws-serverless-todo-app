import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

// TODO: Implement the dataLayer logic

export class TodosAccess {
  private tableName = process.env.TODOS_TABLE
  private XAWS = AWSXRay.captureAWS(AWS)
  private logger = createLogger('TodosAccess')
  private documentClient = new DocumentClient()

  createTodo = async (item: TodoItem) => {
    const todoItem = await this.documentClient
      .put({
        TableName: this.tableName,
        Item: item
      })
      .promise()

    return todoItem
  }
}
