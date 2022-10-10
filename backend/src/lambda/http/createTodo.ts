import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils'
import { createTodo } from '../../helpers/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if (typeof event.body !== 'string') throw new Error('Invalid request')
    const userId = getUserId(event)
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // // TODO: Implement creating a new TODO item
    const todoItem = await createTodo(newTodo, userId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: todoItem
      })
    }
  }
)

handler.use(
  cors({
    credentials: true,
    origin: '*'
  })
)
