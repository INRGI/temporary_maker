import React, { useState, useEffect } from "react";
import { CopyStyles, CopyWhatToReplace, Preset } from "../../types";
import { toastSuccess, toastError } from "../../helpers/toastify";
import FloatingLabelInput from "../FloatingLabelInput/FloatingLabelInput";
import Dropdown from "../Dropdown/Dropdown";
import {
  Container,
  SaveButton,
  InputGroup,
  StyledCheckbox,
  InputContainer,
} from "./StylesBlock.styled";

interface Props {
  preset: Preset;
}

const antiSpamOptions = ["None", "Full Anti Spam", "Spam Words Only"];

const StylesBlock: React.FC<Props> = ({ preset }) => {
  const [styles, setStyles] = useState<CopyStyles>({
    fontSize: "",
    fontFamily: "",
    bgColor: "",
    linkColor: "",
    maxWidth: "",
    lineHeight: "",
    padding: { top: "", right: "", bottom: "", left: "" },
  });
  const [replaceOptions, setReplaceOptions] = useState<CopyWhatToReplace>({
    isFontSize: false,
    isFontFamily: false,
    isBgColor: false,
    isLinkColor: false,
    isMaxWidth: false,
    isLineHeight: false,
    isPadding: { top: false, right: false, bottom: false, left: false },
    isLinkUrl: false,
    isUnsubLink: false,
    isAntiSpam: "None",
    isBotTrap: false,
  });

  useEffect(() => {
    setStyles((prev) => ({ ...preset.copyStyles, ...prev }));
    setReplaceOptions((prev) => ({ ...preset.copyWhatToReplace, ...prev }));
  }, [preset]);

  const handleChange = (key: keyof CopyStyles, value: string) => {
    setStyles((prev) => ({ ...prev, [key]: value }));
  };

  const handleReplaceToggle = (key: keyof CopyWhatToReplace) => {
    setReplaceOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    try {
      const savedPresets = JSON.parse(localStorage.getItem("presets") || "[]");

      const updatedPresets = savedPresets.map((p: Preset) =>
        p.name === preset.name ? { ...p, styles, replaceOptions } : p
      );

      localStorage.setItem("presets", JSON.stringify(updatedPresets));
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
          checked={replaceOptions.isFontFamily}
          onChange={() => handleReplaceToggle("isFontFamily")}
        />
        <InputContainer>
          <FloatingLabelInput
            placeholder="Font Family"
            value={styles.fontFamily}
            onChange={(e) => handleChange("fontFamily", e.target.value)}
          />
        </InputContainer>
      </InputGroup>

      <InputGroup>
        <StyledCheckbox
          type="checkbox"
          checked={replaceOptions.isAntiSpam !== "None"}
          onChange={() =>
            setReplaceOptions((prev) => ({
              ...prev,
              isAntiSpam:
                prev.isAntiSpam === "None" ? "Full Anti Spam" : "None",
            }))
          }
        />
        <Dropdown
          placeholder="Select AntiSpam"
          options={antiSpamOptions}
          selected={replaceOptions.isAntiSpam || "None"}
          onSelect={(value) =>
            setReplaceOptions((prev) => ({ ...prev, isAntiSpam: value as any }))
          }
        />
      </InputGroup>

      <SaveButton onClick={handleSave}>Save</SaveButton>
    </Container>
  );
};

export default StylesBlock;
