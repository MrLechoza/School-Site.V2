import { MdImage, MdPictureAsPdf, MdInsertDriveFile } from "react-icons/md";

const getFileIcon = (filename) => {
    if (!filename || typeof filename !== "string") {
      return "📄"; 
    }

    const extension = filename.split(".").pop().toLowerCase();
    switch (extension) {
      case "jpg":
      case "jpeg":
      case "png":
        return <MdImage className="text-blue-500 size-12 " />;
      case "pdf":
        return <MdPictureAsPdf className="text-red-500 size-12" />;
      default:
        return <MdInsertDriveFile className="text-gray-500 size-12" />;
    }
  };

  export default getFileIcon