import React, { useState, useEffect } from "react";
import { Preset, UploadImage } from "../../../types/health";
import { toastSuccess, toastError } from "../../../helpers/toastify";
import Dropdown from "../../Common/Dropdown/Dropdown";
import {
  Container,
  SaveButton,
  InputGroup,
  StyledCheckbox,
  InputContainer,
} from "./UploadImageBlock.styled";
import FloatingLabelInput from "../../Common/FloatingLabelInput/FloatingLabelInput";

interface Props {
  preset: Preset;
}

const uploadSourceOptions = ["WORDPRESS"];

const UploadImageBlock: React.FC<Props> = ({ preset }) => {
  const [uploadImage, setUploadImage] = useState<UploadImage>({
    isUploadImage: preset?.uploadImage
      ? preset.uploadImage?.isUploadImage
      : false,
    wordpressUrl: preset?.uploadImage ? preset.uploadImage?.wordpressUrl : "",
    username: preset?.uploadImage ? preset.uploadImage?.username : "",
    appPassword: preset?.uploadImage ? preset.uploadImage?.appPassword : "",
    uploadSource: preset?.uploadImage
      ? preset.uploadImage?.uploadSource
      : "WORDPRESS",
  });

  useEffect(() => {
    const savedPreset = JSON.parse(
      localStorage.getItem("health-presets") || "[]"
    );
    const presetFromStorage = savedPreset.find(
      (p: Preset) => p.name === preset.name
    );

    if (presetFromStorage) {
      setUploadImage((prev) => ({ ...presetFromStorage.uploadImage, ...prev }));
    } else {
      setUploadImage((prev) => ({ ...preset.uploadImage, ...prev }));
    }
  }, [preset]);

  const handleChange = (key: keyof UploadImage, value: string | boolean) => {
    setUploadImage((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if(uploadImage.isUploadImage && (!uploadImage.wordpressUrl || !uploadImage.username || !uploadImage.appPassword)){ 
      return toastError("Please fill all the fields");
    }

    try {
      const savedPresets = JSON.parse(
        localStorage.getItem("health-presets") || "[]"
      );
      const updatedPresets = savedPresets.map((p: Preset) =>
        p.name === preset.name ? { ...p, uploadImage: uploadImage } : p
      );

      localStorage.setItem("health-presets", JSON.stringify(updatedPresets));
      toastSuccess("Preset updated successfully.");
    } catch (error) {
      toastError("Error saving preset.");
    }
  };

  return (
    <Container>
      <InputGroup>
        <StyledCheckbox
          type="checkbox"
          checked={uploadImage.isUploadImage}
          onChange={() =>
            handleChange("isUploadImage", !uploadImage.isUploadImage)
          }
        />
        <Dropdown
          placeholder="Select Where to Upload Image"
          options={uploadSourceOptions}
          selected={uploadImage.uploadSource || "WORDPRESS"}
          onSelect={(value) => handleChange("uploadSource", value as string)}
        />
      </InputGroup>

      <InputGroup>
        <InputContainer>
          <FloatingLabelInput
            placeholder="Wordpress URL (example: https://example.com)"
            value={uploadImage.wordpressUrl || ""}
            onChange={(e) => handleChange("wordpressUrl", e.target.value)}
          />
        </InputContainer>
      </InputGroup>

      <InputGroup>
        <InputContainer>
          <FloatingLabelInput
            placeholder="Username (example: admin)"
            value={uploadImage.username || ""}
            onChange={(e) => handleChange("username", e.target.value)}
          />
        </InputContainer>
      </InputGroup>

      <InputGroup>
        <InputContainer>
          <FloatingLabelInput
            placeholder="Application Password (example: y0V6 uedV)"
            value={uploadImage.appPassword || ""}
            onChange={(e) => handleChange("appPassword", e.target.value)}
          />
        </InputContainer>
      </InputGroup>
      <InputGroup>
        <SaveButton onClick={handleSave}>Save</SaveButton>
      </InputGroup>
    </Container>
  );
};

export default UploadImageBlock;
