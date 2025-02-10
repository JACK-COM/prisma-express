/**
 * @file aws.service.ts
 * @description AWS Service (helper functions)
 */

import {
  ListObjectsCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  S3Client
} from "@aws-sdk/client-s3";
import { Request, Response } from "express";
import {
  AWS_DEFAULT_REGION,
  AWS_UPLOADS_URL,
  AWS_USER_IMGS_BUCKET,
  IMGS_BUCKET
} from "../constants";
import { CtxUser } from "../graphql/context";
import { stripSpecialCharacters } from "../utils";

const s3 = new S3Client({ region: AWS_DEFAULT_REGION });
const categoryBucket = {
  users: AWS_USER_IMGS_BUCKET
};
export type ImageCategory = keyof typeof categoryBucket;
const BUCKETS = new Set(Object.keys(categoryBucket));

/** List a user's files in S3 */
export async function listUserFilesHandler(req: Request, res: Response) {
  if (!req.user) return void res.status(401).send("Unauthenticated user");
  const { category } = req.params;
  if (!BUCKETS.has(category))
    return void res.status(400).send({ errors: "Invalid image category" });

  const userId = (req.user as CtxUser).id;
  const files = await listUserAWSFiles(userId, category as ImageCategory);
  return void res.status(200).send({ files });
}

/** @helper Extract image file names from AWS response */
const extractFileNames = (agg: string[], { Key }: any) => {
  if (Key) agg.push(`${AWS_UPLOADS_URL}/${Key}`);
  return agg;
};

/** List images for a specific user in a specific image category */
export async function listUserAWSFiles(
  userId: string | number,
  category: ImageCategory = "users"
) {
  const Prefix = `${category}/${userId}`;
  const command = new ListObjectsCommand({
    Bucket: IMGS_BUCKET,
    Prefix,
    MaxKeys: 500
  });
  const { Contents } = await s3.send(command);
  if (!Contents) return { files: [] };
  return { files: Contents.reduce(extractFileNames, [] as string[]) };
}

/** Delete an image */
export async function fileDeleteHandler(req: any, res: Response) {
  if (!req.user) return void res.status(401).send("Unauthenticated user");
  const { category } = req.params;
  if (!category || !BUCKETS.has(category))
    return void res.status(400).send({ errors: "Invalid image category" });

  const userId = req.user.id;
  const filePath = `${userId}/${req.body.fileName}`;
  await removeFile(IMGS_BUCKET, filePath);
  return void res.status(200).send({ message: "File deleted" });
}

/**
 * Upload image to AWS and return file url.
 * @param {string} req.category - The category of the image (user, book, character)
 * @param {string} req.body.fileName - The name of the file
 * @param {Buffer} req.files.file - The file to upload
 */
export async function fileUploadHandler(req: any, res: Response) {
  if (!req.user)
    return void res.status(401).send({ error: "Unauthenticated user" });
  
  const { file, body, params } = req;
  const { category } = params;
  if (!category || !BUCKETS.has(category))
    return void res.status(400).send({ error: "Invalid image category" });

  let fileData: any = file;
  if (body.fileType === "base64") {
    const cleaned = body.imageFile.replace(/^data:image\/\w+;base64,/, "");
    fileData = Buffer.from(cleaned, "base64");
  } else fileData = file.buffer;
  const removeSpecial = /[^a-zA-Z0-9_.]/g; // strip all characters not found in group
  const result = await handleUploadToAWS({
    fileData,
    fileName: body.fileName.replace(removeSpecial, "_"),
    userId: req.user.id,
    category,
    imgContentType: body.imgContentType
  });
  if (!result)
    return void res.status(500).json({ error: "Error uploading image" });

  // return new file URL
  return void res.status(200).json({ data: result });
}

// HELPER FUNCTIONS

/** HELPER | Upload a file to an AWS bucket */
type AWSFileOpts = {
  ContentType?: string;
  bucketName: string;
  fileData: any;
  filePath: string;
};

type HandleUploadOpts = {
  fileData: any;
  fileName: string;
  userId: number;
  category: ImageCategory;
  imgContentType: string;
};

export async function handleUploadToAWS(opts: HandleUploadOpts) {
  const { fileData, fileName, imgContentType, userId, category } = opts;
  const filename = stripSpecialCharacters(fileName);
  const filePath = `${category}/${userId}/${filename}`;
  const bucketName = IMGS_BUCKET;
  const result = await uploadFile({
    bucketName,
    filePath,
    fileData,
    ContentType: imgContentType
  });
  return void result;
}

export async function uploadFile(opts: AWSFileOpts) {
  const { fileData: file, filePath, ContentType, bucketName } = opts;
  const command = new PutObjectCommand({
    Bucket: bucketName,
    ACL: "public-read",
    Key: filePath,
    Body: file,
    ContentType
  });

  try {
    const data = await s3.send(command);
    return { data, fileURL: `${AWS_UPLOADS_URL}/${filePath}` };
  } catch (err) {
    console.log(err);
    return null;
  }
}

/** HELPER | Delete an object from an AWS S3 bucket */
async function removeFile(Bucket: string, fileName: string) {
  const params: DeleteObjectCommandInput = { Bucket, Key: fileName };
  const command = new DeleteObjectCommand(params);

  try {
    const data = await s3.send(command);
    return { data, fileName };
  } catch (err) {
    console.log(err);
    return null;
  }
}
