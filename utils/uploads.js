const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");
require("dotenv").config();

// Configure the S3 client for DigitalOcean Spaces
const s3 = new S3Client({
  endpoint: "https://nyc3.digitaloceanspaces.com", // Replace "nyc3" with your Spaces region
  region: "us-east-1", // Region (can be arbitrary for Spaces)
  credentials: {
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
  },
});

// Configure Multer for file uploads
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "studyapplication", // Replace with your DigitalOcean Space name
    acl: "public-read", // Make files publicly readable
    key: (req, file, cb) => {
      const fileName = `Users/Profile_Pictures/${Date.now()}_${path.basename(
        file.originalname
      )}`;
      cb(null, fileName); // Set file name
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error("Only images are allowed!"), false); // Reject unsupported files
    }
  },
});

module.exports = upload;
