import { NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const client = new S3Client({
  region: process.env.AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
  },
});

const deleteFileFromS3 = async (path: string) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: path,
  };
  const command = new DeleteObjectCommand(params);
  await client.send(command);
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const filePath = body?.filePath;
    if (!filePath) {
      return NextResponse.json(
        {
          error: "FilePath is required.",
        },
        {
          status: 400,
        }
      );
    }
    await deleteFileFromS3(filePath);
    return NextResponse.json({
      success: true,
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
