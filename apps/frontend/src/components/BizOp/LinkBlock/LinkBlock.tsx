import React, { useState, useEffect } from "react";
import { Preset, LinkUrl } from "../../../types/bizop";
import { toastSuccess, toastError } from "../../../helpers/toastify";
import {
  Container,
  SaveButton,
  InputGroup,
  StyledCheckbox,
  InputContainer,
  SpanWhite,
} from "./LinkBlock.styled";
import FloatingLabelInput from "../../Common/FloatingLabelInput/FloatingLabelInput";
import Loader from "../../Common/Loader";

interface Props {
  preset: Preset;
}

const productCodeOptions: LinkUrl["productCode"][] = [
  "PRODUCT#IMAGE",
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

  useEffect(() => {
    setLoading(true);
    const savedPreset = JSON.parse(localStorage.getItem("bizop-presets") || "[]");
    const presetFromStorage = savedPreset.find(
      (p: Preset) => p.name === preset.name
    );

    if (presetFromStorage?.copyWhatToReplace?.linkUrl) {
      setIsLinkUrl(presetFromStorage.copyWhatToReplace.isLinkUrl);
    }
    if (presetFromStorage?.linkUrl) {
      setLinkUrl(presetFromStorage.linkUrl);
    }
    setLoading(false);
  }, [preset]);

  const handleChange = (key: keyof LinkUrl, value: string) => {
    setLinkUrl((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    try {
      if (
        (isLinkUrl && !linkUrl.linkEnd) ||
        !linkUrl.linkStart
      ) {
        toastError("All inputs are required.");
        return;
      }
      const savedPresets = JSON.parse(localStorage.getItem("bizop-presets") || "[]");
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

      localStorage.setItem("bizop-presets", JSON.stringify(updatedPresets));
      toastSuccess("Preset updated successfully.");
    } catch (error) {
      toastError("Error saving preset.");
    }
  };

  if (loading) {
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
        <InputContainer>
          <FloatingLabelInput
            placeholder="Link end (ex: ?product=)"
            value={linkUrl.linkEnd}
            onChange={(e) => handleChange("linkEnd", e.target.value)}
          />
        </InputContainer>
      </InputGroup>

      <InputGroup>
        <SaveButton onClick={handleSave}>Save</SaveButton>
      </InputGroup>
    </Container>
  );
};

export default LinkBlock;
