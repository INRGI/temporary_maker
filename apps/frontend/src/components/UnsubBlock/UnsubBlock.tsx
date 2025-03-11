import React, { useState, useEffect } from "react";
import { Preset, UnsubLinkUrl, UnsubSheet } from "../../types";
import { toastSuccess, toastError } from "../../helpers/toastify";
import Dropdown from "../Dropdown/Dropdown";
import {
  Container,
  SaveButton,
  InputGroup,
  StyledCheckbox,
  InputContainer,
  SpanWhite,
} from "./UnsubBlock.styled";
import FloatingLabelInput from "../FloatingLabelInput/FloatingLabelInput";
import axios from "axios";
import Loader from "../Loader";

interface Props {
  preset: Preset;
}

const UnsubBlock: React.FC<Props> = ({ preset }) => {
  const [loading, setLoading] = useState(false);
  const [unsubLinkUrl, setUnsubLinkUrl] = useState<UnsubLinkUrl>({
    linkStart: preset?.unsubLinkUrl?.linkStart || "",
    linkEnd: preset?.unsubLinkUrl?.linkEnd || "",
    unsubType: preset?.unsubLinkUrl?.unsubType || "",
    sheetName: preset?.unsubLinkUrl?.sheetName || "",
  });

  const [isUnsubLinkUrl, setIsUnsubLinkUrl] = useState(
    preset?.copyWhatToReplace?.isUnsubLink || false
  );
  const [sheets, setSheets] = useState<UnsubSheet[]>([]);

  useEffect(() => {
    setLoading(true);
    const savedPreset = JSON.parse(localStorage.getItem("presets") || "[]");
    const presetFromStorage = savedPreset.find(
      (p: Preset) => p.name === preset.name
    );

    if (presetFromStorage?.copyWhatToReplace?.isUnsubLink) {
      setIsUnsubLinkUrl(presetFromStorage.copyWhatToReplace.isUnsubLink);
    }
    if (presetFromStorage?.unsubLinkUrl) {
      setUnsubLinkUrl(presetFromStorage.unsubLinkUrl);
    }
    fetchSheets();
    setLoading(false);
  }, [preset]);

  const handleChange = (key: keyof UnsubLinkUrl, value: string) => {
    setUnsubLinkUrl((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    try {
      if (
        (isUnsubLinkUrl && !unsubLinkUrl.linkEnd) ||
        !unsubLinkUrl.linkEnd ||
        !unsubLinkUrl.linkStart ||
        !unsubLinkUrl.sheetName ||
        !unsubLinkUrl.unsubType
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
                isUnsubLinkUrl,
              },
              unsubLinkUrl,
            }
          : p
      );

      localStorage.setItem("presets", JSON.stringify(updatedPresets));
      toastSuccess("Preset updated successfully.");
    } catch (error) {
      toastError("Error saving preset.");
    }
  };

  const fetchSheets = async () => {
    try {
      const response = await axios.get(`/api/priority-products/types`);
      setSheets(response.data.sheets);
    } catch (error) {
      toastError("Error fetching trackings");
    }
  };

  if (loading || !sheets) {
    return <Loader />;
  }

  return (
    <Container>
      <InputGroup>
        <StyledCheckbox
          type="checkbox"
          checked={isUnsubLinkUrl}
          onChange={() => setIsUnsubLinkUrl((prev) => !prev)}
        />
        <SpanWhite>Enable unsub building?</SpanWhite>
      </InputGroup>

      <InputGroup>
        <Dropdown
          placeholder="Select prioriti sheet"
          options={sheets.map((sheet) => sheet.sheetName)}
          selected={unsubLinkUrl.sheetName}
          onSelect={(value) => handleChange("sheetName", value as string)}
        />
      </InputGroup>

      {unsubLinkUrl.sheetName && (
        <InputGroup>
          <Dropdown
            placeholder="Select unsub column"
            options={
              sheets.find((sheet) => sheet.sheetName === unsubLinkUrl.sheetName)
                ?.unsubTypes || []
            }
            selected={unsubLinkUrl.unsubType}
            onSelect={(value) => handleChange("unsubType", value as string)}
          />
        </InputGroup>
      )}

      <InputGroup>
        <InputContainer>
          <FloatingLabelInput
            placeholder="Link start (ex: https://www.example.com/)"
            value={unsubLinkUrl.linkStart}
            onChange={(e) => handleChange("linkStart", e.target.value)}
          />
        </InputContainer>
      </InputGroup>

      <InputGroup>
        <InputContainer>
          <FloatingLabelInput
            placeholder="Link end (ex: ?source=example)"
            value={unsubLinkUrl.linkEnd}
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

export default UnsubBlock;
