import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ErrorResponse } from "../utils/ErrorResponse.js";
// import Product from "../models/product.js";
import express from "express";

const s3 = new S3Client({
  region: process.env.AWS_REGION, // e.g., 'us-east-1'
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export function imageValidation(req, res, next) {
  // console.log("Image validation: ", req);
  const imageFile = req.file;
  console.log("Image validation: ", imageFile);
  if (imageFile === undefined) return res.status(400).json({ error: "File not found", message: "Please select file to upload" });
  if (imageFile.mimetype.split("/")[0] !== "  ") return res.status(400).json({ error: "Non image", message: "File is not an image" });
  if (imageFile.size > 1000000) return res.status(400).json({ error: "Too large", message: "File is too large. Max size is 1MB" });

  next();
}

const S3Router = express.Router();

export async function uploadImageS3(req, res, next) {
  {
    // if (!req.file) throw new ErrorResponse("No file uploaded", 400);

    const { fileName, fileType } = req.body;

    try {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `patterns/${fileName}`, // e.g., patterns/image1.jpg
        ContentType: fileType,
      };

      // Generate a pre-signed URL for PUT operation
      const command = new PutObjectCommand(params);
      const uploadURL = await getSignedUrl(s3, command, { expiresIn: 60 });

      res.json({ uploadURL });
    } catch (error) {
      console.error("Error generating pre-signed URL:", error); // Log full error
      res.status(500).json({ error: "Error generating pre-signed URL", details: error.message });
    }
  }
}

export const deleteImageFromS3 = async (imageUrl) => {
  // Extract the file name from the URL
  const urlParts = imageUrl.split("/");
  const fileName = urlParts[urlParts.length - 1].split("?")[0]; // Get the filename only

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `patterns/${fileName}`, // Adjust the path if necessary
  };

  try {
    await s3.send(new DeleteObjectCommand(params));
    console.log(`Successfully deleted ${imageUrl} from S3`);
  } catch (error) {
    console.error("Error deleting image from S3:", error);
  }
};

S3Router.route("/").post(uploadImageS3);

export default S3Router;
