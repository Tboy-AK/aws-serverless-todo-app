import { captureAWSClient } from 'aws-xray-sdk'
import * as S3 from 'aws-sdk/clients/s3'
import { Endpoint } from 'aws-sdk'
import { createLogger } from '../utils/logger'

const XS3 = captureAWSClient(S3)

// TODO: Implement the fileStogare logic

const s3ClientConfig: S3.ClientConfiguration = process.env.IS_OFFLINE
  ? {
      signatureVersion: 'v4',
      s3ForcePathStyle: true,
      // accessKeyId: 'S3RVER',
      // secretAccessKey: 'S3RVER',
      endpoint: new Endpoint(process.env.ATTACHMENT_S3_BUCKET_ENDPOINT_LOCAL)
    }
  : { signatureVersion: 'v4' }

export class AttachmentUtils {
  private readonly s3Client = new XS3(s3ClientConfig)
  private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET
  private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION

  createAttachmentPresignedUrl = (imageId: string) => {
    const BucketOperation = 'putObject'
    if (process.env.IS_OFFLINE) {
      const logger = createLogger('TodosAccess')
      logger.info('Creating local DynamoDB client')
      return this.s3Client.getSignedUrl(BucketOperation, {
        region: 'localhost',
        endpoint: process.env.DYNAMO_DB_ENDPOINT_LOCAL
      })
    }
    return this.s3Client.getSignedUrl(BucketOperation, {
      Bucket: this.bucketName,
      Key: imageId,
      Expires: this.urlExpiration
    })
  }
}
