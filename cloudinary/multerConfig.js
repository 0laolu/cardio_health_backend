import multer from "multer";
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from "cloudinary";

// Configuring Cloudinary with credentials
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

// Set up Cloudinary storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "uploads", // Folder in Cloudinary
        allowed_formats: ["jpeg", "jpg", "png"],
        transformation: [{ width: 500, height: 500, crop: "limit" }]
    }
});

export const upload = multer({ storage: storage });
