import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import getFileIcon from "./obtenerIcono";

const UploadComponent = ({ onFileChange }) => {
  const [files, setFiles] = useState([]);


  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);

    if (onFileChange && selectedFiles.length > 0) {
      onFileChange(selectedFiles);
    }
  };

  const handleRemoveFile = (fileToRemove) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((file) => file.name !== fileToRemove.name);
      if (onFileChange) {
        onFileChange(updatedFiles);
      }
      return updatedFiles;
    });
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-md min-w-full">
      <input
        type="file"
        name="archivo"
        multiple 
        onChange={handleFileChange}
        className="mb-2 p-2 border border-blue-500 rounded w-full cursor-pointer"
      />
      <ul className="list-none p-0">
        {files.map((file) => (
          <li
            key={file.name}
            className="flex justify-between items-center p-2 mb-2 border border-gray-200 rounded bg-white"
          >
            <span className="mr-2">{getFileIcon(file.name)}</span>
            <span className="flex-grow mr-2 truncate">{file.name}</span>
            <button
              type="button"
              onClick={() => handleRemoveFile(file)}
              className="bg-red-500 text-white rounded px-2 py-1 hover:bg-red-600 transition-colors"
            >
              <FaTrash size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UploadComponent;
