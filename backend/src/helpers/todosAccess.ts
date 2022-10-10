import { captureAWSClient } from 'aws-xray-sdk'
import { DocumentClient, QueryOutput } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

// TODO: Implement the dataLayer logic
interface UpdateTodoKeyInterface {
  userId: string
  todoId: string
}

const XAWS = captureAWSClient(DocumentClient)

export class TodosAccess {
  private readonly tableName = process.env.TODOS_TABLE
  private readonly indexName = process.env.TODOS_CREATED_AT_INDEX
  private logger = createLogger('TodosAccess')
  private documentClient = createDynamodbClient()

  createTodo = async (item: TodoItem) => {
    const response = await this.documentClient
      .put({
        TableName: this.tableName,
        Item: item
      })
      .promise()
    this.logger.info('Insert Document Successful')

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
    this.logger.info('Update Document Successful')

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
    this.logger.info('Delete Document Successful')

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
    this.logger.info('Get Document Successful')

    const todoItem = response.$response.data as QueryOutput
    return todoItem.Items
  }
}

function createDynamodbClient() {
  if (process.env.IS_OFFLINE) {
    const logger = createLogger('TodosAccess')
    logger.info('Creating local DynamoDB client')
    return new XAWS({
      region: 'localhost',
      endpoint: process.env.DYNAMO_DB_ENDPOINT_LOCAL
    })
  }
  return new XAWS()
}
