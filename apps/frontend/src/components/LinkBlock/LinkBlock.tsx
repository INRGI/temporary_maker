import React, { useState, useEffect } from "react";
import { Preset, LinkUrl } from "../../types";
import { toastSuccess, toastError } from "../../helpers/toastify";
import Dropdown from "../Dropdown/Dropdown";
import {
  Container,
  SaveButton,
  InputGroup,
  StyledCheckbox,
  InputContainer,
  SpanWhite,
} from "./LinkBlock.styled";
import FloatingLabelInput from "../FloatingLabelInput/FloatingLabelInput";
import axios from "axios";
import Loader from "../Loader";

interface Props {
  preset: Preset;
}

const productCodeOptions: LinkUrl["productCode"][] = [
  "PRODUCT#IMAGE",
  "IMG0000_#IMAGE",
  "0000_#IMAGE",
  "000_#IMAGE",
];

const LinkBlock: React.FC<Props> = ({ preset }) => {
  const [loading, setLoading] = useState(false);
  const [linkUrl, setLinkUrl] = useState<LinkUrl>({
    linkStart: preset?.linkUrl?.linkStart || "",
    linkEnd: preset?.linkUrl?.linkEnd || "",
    trackingType: preset?.linkUrl?.trackingType || "",
    productCode: preset?.linkUrl?.productCode || productCodeOptions[0],
  });

  const [isLinkUrl, setIsLinkUrl] = useState(
    preset?.copyWhatToReplace?.isLinkUrl || false
  );
  const [trackings, setTrackings] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    const savedPreset = JSON.parse(localStorage.getItem("presets") || "[]");
    const presetFromStorage = savedPreset.find(
      (p: Preset) => p.name === preset.name
    );

    if (presetFromStorage?.copyWhatToReplace?.linkUrl) {
      setIsLinkUrl(presetFromStorage.copyWhatToReplace.isLinkUrl);
    }
    if (presetFromStorage?.linkUrl) {
      setLinkUrl(presetFromStorage.linkUrl);
    }
    fetchTrackings();
    setLoading(false);
  }, [preset]);

  const handleChange = (key: keyof LinkUrl, value: string) => {
    setLinkUrl((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    try {
      if (
        (isLinkUrl && !linkUrl.linkEnd) ||
        !linkUrl.linkStart ||
        !linkUrl.trackingType ||
        !linkUrl.productCode
      ) {
        toastError("All inputs are required.");
        return;
      }
      const savedPresets = JSON.parse(localStorage.getItem("presets") || "[]");
      const updatedPresets = savedPresets.map((p: Preset) =>
        p.name === preset.name
          ? {
              ...p,
              copyWhatToReplace: {
                ...p.copyWhatToReplace,
                isLinkUrl,
              },
              linkUrl,
            }
          : p
      );

      localStorage.setItem("presets", JSON.stringify(updatedPresets));
      toastSuccess("Preset updated successfully.");
    } catch (error) {
      toastError("Error saving preset.");
    }
  };

  const fetchTrackings = async () => {
    try {
      const response = await axios.get(`/api/copy/trackings`);
      setTrackings(response.data.trackings);
    } catch (error) {
      toastError("Error fetching trackings");
    }
  };

  if (loading || !trackings) {
    return <Loader />;
  }

  return (
    <Container>
      <InputGroup>
        <StyledCheckbox
          type="checkbox"
          checked={isLinkUrl}
          onChange={() => setIsLinkUrl((prev) => !prev)}
        />
        <SpanWhite>Enable build link?</SpanWhite>
      </InputGroup>

      <InputGroup>
        <InputContainer>
          <FloatingLabelInput
            placeholder="Link start (ex: https://www.example.com/)"
            value={linkUrl.linkStart}
            onChange={(e) => handleChange("linkStart", e.target.value)}
          />
        </InputContainer>
      </InputGroup>

      <InputGroup>
        <Dropdown
          placeholder="Select tracking type"
          options={trackings}
          selected={linkUrl.trackingType}
          onSelect={(value) => handleChange("trackingType", value as string)}
        />
      </InputGroup>

      <InputGroup>
        <InputContainer>
          <FloatingLabelInput
            placeholder="Link end (ex: ?product=)"
            value={linkUrl.linkEnd}
            onChange={(e) => handleChange("linkEnd", e.target.value)}
          />
        </InputContainer>
      </InputGroup>

      <InputGroup>
        <Dropdown
          placeholder="Product code type ex: BTUA1OS1"
          options={productCodeOptions}
          selected={linkUrl.productCode}
          onSelect={(value) => handleChange("productCode", value as string)}
        />
      </InputGroup>

      <InputGroup>
        <SaveButton onClick={handleSave}>Save</SaveButton>
      </InputGroup>
    </Container>
  );
};

export default LinkBlock;
