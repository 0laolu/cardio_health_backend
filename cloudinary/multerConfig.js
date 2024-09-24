import multer from "multer";
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "uploads", // optional folder to store images in Cloudinary
        allowed_formats: ["jpeg", "jpg", "png"],
        transformation: [{ width: 500, height: 500, crop: "limit" }],
      }
})

export const upload = multer({ storage: storage })