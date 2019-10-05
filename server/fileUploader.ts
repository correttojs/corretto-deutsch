import * as AWS from 'aws-sdk';
import * as fs from 'fs';

const s3Client = new AWS.S3();

const BUCKET_NAME = 'corretto';
console.log(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);
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
    return fileName.replace('./', '');
  } catch (e) {
    return null;
  }
};

export const getFile = (fileName: string) => {
  return s3Client
    .getObject({
      Bucket: BUCKET_NAME,
      Key: `audio/${fileName}`,
    })
    .createReadStream();
};
