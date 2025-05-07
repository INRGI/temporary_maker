/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import { FaWordpress } from "react-icons/fa6";
import { toastError, toastSuccess } from "../../../helpers/toastify";
import { Button } from "./UploadToWordpressButtonFromUrl.styled";
import { Rings } from "react-loader-spinner";

interface UploadImageProps {
  wordpressUrl: string;
  username: string;
  appPassword: string;
  onUploadMade: (url: string) => void;
}

const UploadToWordpressButtonFromFile: React.FC<UploadImageProps> = ({
  wordpressUrl,
  username,
  appPassword,
  onUploadMade,
}) => {
  const [isUploading, setIsUploading] = React.useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const inputId = React.useId();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return toastError("Please select an image");
    }
    setSelectedImage(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedImage || !wordpressUrl || !username || !appPassword) {
      toastError("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append(
      "body",
      JSON.stringify({
        wordpressUrl,
        username,
        appPassword,
      })
    );
    formData.append("image", selectedImage);

    try {
      setIsUploading(true);
      if (!wordpressUrl || !username || !appPassword) {
        toastError("You need to provide all WordPress data");
      }
      const response = await axios.post(
        "/api/health/image-upload/file",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
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

  const handleClick = () => {
    if (!selectedImage) {
      const input = document.getElementById(inputId);
      if (input) input.click();
    }

    if (selectedImage) {
      handleUpload();
    }
  };

  return (
    <div style={{ margin: "0", padding: "0" }}>
      <input
        id={inputId}
        accept="image/*"
        type="file"
        onChange={handleImageChange}
        style={{ display: "none" }}
      />
      <Button
        disabled={isUploading}
        onClick={handleClick}
        style={{ color: `${selectedImage ? "#4caf50" : "#fff"}` }}
      >
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
          <FaWordpress size={24} />
        )}
      </Button>
    </div>
  );
};

export default UploadToWordpressButtonFromFile;
