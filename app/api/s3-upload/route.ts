import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const client = new S3Client({
  region: process.env.AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
  },
});

const uploadFileToS3 = async (
  fileBuffer: Buffer,
  folder: string,
  fileType: string
) => {
  const uniqueId = Math.random().toString(36).substring(2, 9);
  const path = `${folder}/${uniqueId}.${fileType}`;
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: path,
    Body: fileBuffer,
    ContentType: "image/jpg",
  };
  const command = new PutObjectCommand(params);
  await client.send(command);
  return path;
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const path = formData.get("path") as string;
    if (!file) {
      return NextResponse.json(
        {
          error: "File is required.",
        },
        {
          status: 400,
        }
      );
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileType = file.type.split("/").pop() + "";
    const filePath = await uploadFileToS3(buffer, path, fileType);
    return NextResponse.json({
      filePath,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Error uploading file",
      },
      {
        status: 500,
      }
    );
  }
}
