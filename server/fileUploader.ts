import * as AWS from 'aws-sdk';
import * as fs from 'fs';

const s3Client = new AWS.S3();

const BUCKET_NAME = 'corretto';
console.log(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);

const fileNameToKey = (fileName: string) => fileName.replace('./', '');

export const uploadFile = (fileName: string) => {
  console.log('UPLOADNG', fileNameToKey(fileName));
  const fileContent = fs.readFileSync(fileName);
  s3Client
    .upload({
      Bucket: BUCKET_NAME,
      ACL: 'public-read',
      Key: fileNameToKey(fileName),
      Body: fileContent,
    })
    .promise();
};

export const deleteFile = (fileName: string) => {
  console.log('DELETING', fileNameToKey(fileName));
  s3Client
    .deleteObject({
      Bucket: BUCKET_NAME,
      Key: fileNameToKey(fileName),
    })
    .promise();
};

export const getS3PAth = async (fileName: string) => {
  try {
    console.log('TESTING', fileNameToKey(fileName));
    await s3Client
      .headObject({
        Bucket: BUCKET_NAME,
        Key: fileNameToKey(fileName),
      })
      .promise();
    return fileName.replace('./', '/');
  } catch (e) {
    console.log(fileName, e.code);
    return null;
  }
};

export const getFile = (fileName: string) => {
  console.log('GETTING', fileName);
  if (getS3PAth(fileName)) {
    return s3Client
      .getObject({
        Bucket: BUCKET_NAME,
        Key: `audio/${fileName}`,
      })
      .createReadStream();
  }
  return null;
};
