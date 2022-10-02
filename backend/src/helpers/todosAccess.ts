import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
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
    const todoItem = await this.documentClient
      .put({
        TableName: this.tableName,
        Item: item
      })
      .promise()

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

    const todoItem = await this.documentClient
      .update({
        TableName: this.tableName,
        Key: key,
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues
      })
      .promise()

    return todoItem
  }

  deleteTodo = async (key: UpdateTodoKeyInterface) => {
    const todoItem = await this.documentClient
      .delete({
        TableName: this.tableName,
        Key: key
      })
      .promise()

    return todoItem
  }

  getTodosForUser = async (userId: string) => {
    const todoItem = await this.documentClient
      .query({
        TableName: this.tableName,
        IndexName: this.indexName,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()
    return todoItem
  }
}
