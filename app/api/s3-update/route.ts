import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const client = new S3Client({
  region: process.env.AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
  },
});

const updateFileToS3 = async (fileBuffer: Buffer, path: string) => {
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
    if (!file || !path) {
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
    const fileName = await updateFileToS3(buffer, path);
    return NextResponse.json({
      success: true,
      fileName: fileName,
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
