const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const router = express.Router();

// Set up AWS S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: 'your-region'  // AWS S3 region, for example: 'us-west-1'
});

// Set up multer storage (memory storage for files)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// File upload route
router.post('/', upload.single('file'), (req, res) => {
    const file = req.file;
    const fileName = Date.now() + file.originalname;

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read' // Making file publicly accessible
    };

    s3.upload(params, (err, data) => {
        if (err) {
            return res.status(500).send('Error uploading file');
        }
        res.status(200).json({ fileUrl: data.Location });
    });
});

module.exports = router;
