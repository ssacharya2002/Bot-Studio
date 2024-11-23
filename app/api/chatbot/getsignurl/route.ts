import S3 from "aws-sdk/clients/s3";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";


const s3 = new S3({
  apiVersion: "2006-03-01",
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.REGION,
  signatureVersion: "v4",
});

export async function GET() {
  const Key = uuid();

  const s3Params = {
    Bucket: process.env.BUCKET_NAME,
    Key,
    Expires: 60,
    ContentType: `application/pdf`,
  };

  const uploadUrl = await s3.getSignedUrl("putObject", s3Params);

  console.log("uploadUrl", uploadUrl);

  return NextResponse.json({ uploadUrl, Key });
}
