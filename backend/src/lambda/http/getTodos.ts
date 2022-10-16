import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils'
import { getTodosForUser } from '../../helpers/todos'

// TODO: Get all TODO items for a current user

async function lambdaHandler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const userId = getUserId(event)
  /** @todo Write your code here */
  const todos = await getTodosForUser(userId)
  console.log()

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
