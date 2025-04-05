import React, { useState } from 'react';
import { uploadFile } from '../api';

const FileUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file');
      return;
    }
    try {
      const res = await uploadFile(file);
      setMessage(res.data.message);
      setFile(null);
      onUpload(); // Trigger refresh of message list
    } catch (err) {
      setMessage(err.response?.data?.error || 'Upload failed');
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload CSV</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FileUpload;