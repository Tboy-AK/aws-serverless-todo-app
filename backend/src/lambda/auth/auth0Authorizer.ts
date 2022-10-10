import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import { verify } from 'jsonwebtoken'
import Axios from 'axios'
import { createLogger } from '../../utils/logger'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

const jwksUrl = process.env.JWKLS_URL

interface Auth0TokenKey {
  alg: string
  kty: string
  use: string
  n: string
  e: string
  kid: string
  x5t: string
  x5c: Array<string>
}

interface Auth0TokenSuccessResponse {
  keys: Array<Auth0TokenKey>
}

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const auth0response = await Axios.get(jwksUrl)
  const jwtSigningDetails: Auth0TokenSuccessResponse = auth0response.data
  const keys = jwtSigningDetails.keys
  const certBodyText = keys[0].x5c[0]
  const cert = structureCert(certBodyText)
  const token = getToken(authHeader)

  const jwt = verify(token, cert, {
    complete: true,
    algorithms: ['RS256']
  }) as Jwt

  return jwt.payload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

function structureCert(cert: string) {
  const BEGIN_CERTIFICATE = '-----BEGIN CERTIFICATE-----'
  const END_CERTIFICATE = '-----END CERTIFICATE-----'
  let body = ''
  body += `${BEGIN_CERTIFICATE}\n`

  for (let i = 0; i < cert.length; i++) {
    if (i === cert.length - 1) body += `${cert[i]}\n`
    else {
      if (i % 64 === 0) body += '\n'
      body += cert[i]
    }
  }

  body += END_CERTIFICATE

  return body
}
