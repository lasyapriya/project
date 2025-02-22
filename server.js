const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 5000;

// In-memory database to store file metadata (file name and custom code)
let fileDatabase = {};  // Declare the fileDatabase globally

// Configure Multer for file upload (storage settings)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify upload folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp to avoid file name collisions
  }
});

const upload = multer({ storage: storage });

// Serve static files (e.g., index.html, JS, CSS)
app.use(express.static('public'));

// Root route to serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for file upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file || !req.body.customCode) {
    return res.status(400).send({ message: 'File or custom code missing' });
  }

  const customCode = req.body.customCode;

  // Store file metadata in the fileDatabase
  fileDatabase[customCode] = {
    filename: req.file.filename,
    originalName: req.file.originalname
  };

  const fileUrl = `http://localhost:5000/file/${customCode}`;
  res.json({ code: customCode, fileUrl });
});

// Route for serving the uploaded file using custom code
app.get('/file/:code', (req, res) => {
  const { code } = req.params;
  const file = fileDatabase[code]; // Retrieve file metadata based on custom code

  if (!file) {
    return res.status(404).send('File not found');
  }

  // Send the file from the 'uploads' folder
  res.sendFile(path.join(__dirname, 'uploads', file.filename));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
