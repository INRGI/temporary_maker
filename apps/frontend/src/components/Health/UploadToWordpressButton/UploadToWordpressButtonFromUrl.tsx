/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import axios from "axios";
import { FaWordpress } from "react-icons/fa6";
import { toastError, toastSuccess } from "../../../helpers/toastify";
import { Button } from "./UploadToWordpressButtonFromUrl.styled";
import { Rings } from "react-loader-spinner";

interface UploadImageProps {
  imageUrl: string;
  wordpressUrl: string;
  username: string;
  appPassword: string;
  onUploadMade: (url: string) => void;
}

const UploadToWordpressButtonFromUrl: React.FC<UploadImageProps> = ({
  imageUrl,
  wordpressUrl,
  username,
  appPassword,
  onUploadMade,
}) => {
  const [isUploading, setIsUploading] = React.useState(false);
  const handleUpload = async () => {
    try {
      setIsUploading(true);
      if (!imageUrl || !wordpressUrl || !username || !appPassword) {
        toastError("You need to provide all WordPress data");
      }
      const response = await axios.post("/api/health/image-upload/url", {
        imageUrl,
        wordpressUrl,
        username,
        appPassword,
      });
      if (!response.data) {
        toastError("Failed to upload image");
      }
      onUploadMade(response.data);
      toastSuccess("Image uploaded successfully");
    } catch (error) {
      toastError("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Button disabled={isUploading}>
      {isUploading ? (
        <Rings
        visible={true}
        height="40"
        width="40"
        color="#e63946"
        ariaLabel="rings-loading"
        wrapperStyle={{}}
        wrapperClass=""
        />
      ) : (
        <FaWordpress size={24} onClick={handleUpload} />
      )}
    </Button>
  );
};

export default UploadToWordpressButtonFromUrl;
