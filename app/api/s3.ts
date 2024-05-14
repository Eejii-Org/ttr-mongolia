import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const client = new S3Client({
  region: process.env.AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
  },
});

export const uploadFileToS3 = async (file: File, folder: string) => {
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${folder}/${file.name}-${Date.now()}`,
    Body: fileBuffer,
    ContentType: "image/jpg",
  };
  const command = new PutObjectCommand(params);
  await client.send(command);
  return `${folder}/${file.name}-${Date.now()}`;
};

export const deleteFileFromS3 = async (path: string) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: path,
  };
  const command = new DeleteObjectCommand(params);
  await client.send(command);
};
