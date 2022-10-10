import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getTodosForUser } from '../../helpers/todos'
import { getUserId } from '../utils'

// TODO: Get all TODO items for a current user

async function lambdaHandler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const userId = getUserId(event)
  // Write your code here
  const todos = await getTodosForUser(userId)

  return {
    statusCode: 200,
    body: JSON.stringify({
      items: todos
    })
  }
}

const handler = middy(lambdaHandler)
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))

export default handler
