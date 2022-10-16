import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils'
import { createAttachmentPresignedUrl } from '../../helpers/todos'

const lambdaHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId
  /** @todo Return a presigned URL to upload a file for a TODO item with the provided id */
  const presignedUrl = createAttachmentPresignedUrl(todoId, userId)

  return {
    statusCode: 201,
    body: JSON.stringify({
      uploadUrl: presignedUrl
    })
  }
}

const handler = middy(lambdaHandler)
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))

export default handler
