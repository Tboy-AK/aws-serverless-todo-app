import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import { updateTodo } from '../../helpers/todos'

export const lambdaHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  /** @todo Update a TODO item with the provided id using values in the "updatedTodo" object */
  await updateTodo(updatedTodo, todoId, userId)

  return {
    statusCode: 204,
    body: JSON.stringify({})
  }
}

const handler = middy(lambdaHandler)
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))

export default handler
