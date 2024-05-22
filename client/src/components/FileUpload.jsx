import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append("files", file);
      const bodyData = {
        usage: "example",
        legacyBuild: true,
        metadata: { key: "val" },
        pineconeNamespace: "usercorey1"
      };

      try {
        const response = await axios.post(
          "https://copilot-flowise.onrender.com/api/v1/vector/upsert/6332d58a-413d-4dbb-8ff4-4bfb53dcd30d",
          formData,
          { params: bodyData }
        );
        setMessage(`Success: ${response.status}`);
      } catch (error) {
        setMessage(`Error: ${error.response ? error.response.status : error.message}`);
      }
    }
  };

  return (
    <div className="file-upload-container">
      <h2>Upload a File</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FileUpload;