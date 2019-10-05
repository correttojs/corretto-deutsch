import * as AWS from 'aws-sdk';
import * as fs from 'fs';

const s3Client = new AWS.S3();

if (process.env.aws_access_key_id) {
  s3Client.config = new AWS.Config({
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key,
  });
}

const BUCKET_NAME = 'corretto';

export const uploadFile = (fileName: string) => {
  const fileContent = fs.readFileSync(fileName);
  s3Client
    .upload({
      Bucket: BUCKET_NAME,
      ACL: 'public-read',
      Key: fileName.replace('./', ''),
      Body: fileContent,
    })
    .promise();
};

export const deleteFile = (fileName: string) => {
  s3Client
    .deleteObject({
      Bucket: BUCKET_NAME,
      Key: fileName.replace('./', ''),
    })
    .promise();
};

export const getS3PAth = async (fileName: string) => {
  try {
    await s3Client
      .headObject({
        Bucket: BUCKET_NAME,
        Key: fileName.replace('./', ''),
      })
      .promise();
    return fileName.replace('./', 'https://corretto.s3.eu-central-1.amazonaws.com/');
  } catch (e) {
    return null;
  }
};
