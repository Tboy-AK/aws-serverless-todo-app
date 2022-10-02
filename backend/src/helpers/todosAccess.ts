import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient, QueryOutput } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

// TODO: Implement the dataLayer logic
interface UpdateTodoKeyInterface {
  userId: string
  todoId: string
}

export class TodosAccess {
  private readonly tableName = process.env.TODOS_TABLE
  private readonly indexName = process.env.TODOS_CREATED_AT_INDEX
  private XAWS = AWSXRay.captureAWS(AWS)
  private logger = createLogger('TodosAccess')
  private documentClient = new DocumentClient()

  createTodo = async (item: TodoItem) => {
    const response = await this.documentClient
      .put({
        TableName: this.tableName,
        Item: item
      })
      .promise()

    const todoItem: any = response.$response.data

    return todoItem
  }

  updateTodo = async (item: TodoUpdate, key: UpdateTodoKeyInterface) => {
    let updateExpression = 'set '
    const expressionAttributeNames = {}
    const expressionAttributeValues = {}

    Object.keys(item).forEach((attribute, i, attributes) => {
      updateExpression += `#${attribute} = :${attribute}`
      updateExpression += i === attributes.length - 1 ? '' : ', '

      expressionAttributeNames[`#${attribute}`] = attribute
      expressionAttributeValues[`:${attribute}`] = item[attribute]
    })

    const response = await this.documentClient
      .update({
        TableName: this.tableName,
        Key: key,
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues
      })
      .promise()

    const todoItem: any = response.$response.data

    return todoItem
  }

  deleteTodo = async (key: UpdateTodoKeyInterface) => {
    const response = await this.documentClient
      .delete({
        TableName: this.tableName,
        Key: key
      })
      .promise()

    const todoItem: any = response.$response.data

    return todoItem
  }

  getTodosForUser = async (userId: string) => {
    const response = await this.documentClient
      .query({
        TableName: this.tableName,
        IndexName: this.indexName,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    const todoItem = response.$response.data as QueryOutput
    return todoItem.Items
  }
}
