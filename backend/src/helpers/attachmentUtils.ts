import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'

// const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic

export class AttachmentUtils {
  private readonly s3Client = new AWS.S3({ signatureVersion: 'v4' })
  private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET
  private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION

  createAttachmentPresignedUrl = (imageId: string) => {
    return this.s3Client.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: imageId,
      Expires: this.urlExpiration
    })
  }
}
