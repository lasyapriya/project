// src/UploadFile.js
import React, { useState } from 'react';
import axios from 'axios';  // Axios is used for making HTTP requests

const UploadFile = () => {
  const [file, setFile] = useState(null);  // To store the selected file
  const [fileUrl, setFileUrl] = useState('');  // To store the uploaded file URL

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);  // Store the selected file
  };

  // Handle file submission (upload)
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent form from reloading

    // If no file is selected, don't proceed
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    const formData = new FormData();  // Create a new FormData object
    formData.append('file', file);  // Append the selected file to the form data

    try {
      // Make a POST request to the backend API to upload the file
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },  // Specify the form data header
      });

      // On success, set the URL of the uploaded file
      setFileUrl(response.data.fileUrl);  // Assuming the backend returns the file URL
    } catch (error) {
      console.error('Error uploading file', error);
      alert('Error uploading file');
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload a File</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} /> {/* File input field */}
        <button type="submit">Upload</button>
      </form>

      {fileUrl && (
        <div>
          <h3>File uploaded successfully!</h3>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            View Uploaded File
          </a>
        </div>
      )}
    </div>
  );
};

export default UploadFile;
