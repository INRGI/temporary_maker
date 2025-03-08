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
  LeftContainer,
  RightContainer,
} from "./StylesBlock.styled";

interface Props {
  preset: Preset;
}

const antiSpamOptions = ["None", "Full Anti Spam", "Spam Words Only"];

const StylesBlock: React.FC<Props> = ({ preset }) => {
  const [styles, setStyles] = useState<CopyStyles>({
    fontSize: preset.copyStyles ? preset.copyStyles.fontSize : "",
    fontFamily: preset.copyStyles ? preset.copyStyles.fontFamily : "",
    bgColor: preset.copyStyles ? preset.copyStyles.bgColor : "",
    linkColor: preset.copyStyles ? preset.copyStyles.linkColor : "",
    maxWidth: preset.copyStyles ? preset.copyStyles.maxWidth : "",
    lineHeight: preset.copyStyles ? preset.copyStyles.lineHeight : "",
    padding: {
      top: preset.copyStyles ? preset.copyStyles.padding.top : "",
      right: preset.copyStyles ? preset.copyStyles.padding.right : "",
      bottom: preset.copyStyles ? preset.copyStyles.padding.bottom : "",
      left: preset.copyStyles ? preset.copyStyles.padding.left : "",
    },
  });
  const [replaceOptions, setReplaceOptions] = useState<CopyWhatToReplace>({
    isFontSize:
      (preset.copyWhatToReplace && preset.copyWhatToReplace.isFontSize) ||
      false,
    isFontFamily:
      (preset.copyWhatToReplace && preset.copyWhatToReplace.isFontFamily) ||
      false,
    isBgColor:
      (preset.copyWhatToReplace && preset.copyWhatToReplace.isBgColor) || false,
    isLinkColor:
      (preset.copyWhatToReplace && preset.copyWhatToReplace.isLinkColor) ||
      false,
    isMaxWidth:
      (preset.copyWhatToReplace && preset.copyWhatToReplace.isMaxWidth) ||
      false,
    isLineHeight:
      (preset.copyWhatToReplace && preset.copyWhatToReplace.isLineHeight) ||
      false,
    isPadding: {
      top:
        (preset.copyWhatToReplace && preset.copyWhatToReplace.isPadding.top) ||
        false,
      right:
        (preset.copyWhatToReplace &&
          preset.copyWhatToReplace.isPadding.right) ||
        false,
      bottom:
        (preset.copyWhatToReplace &&
          preset.copyWhatToReplace.isPadding.bottom) ||
        false,
      left:
        (preset.copyWhatToReplace && preset.copyWhatToReplace.isPadding.left) ||
        false,
    },
    isLinkUrl:
      (preset.copyWhatToReplace && preset.copyWhatToReplace.isLinkUrl) || false,
    isUnsubLink:
      (preset.copyWhatToReplace && preset.copyWhatToReplace.isUnsubLink) ||
      false,
    isAntiSpam:
      (preset.copyWhatToReplace && preset.copyWhatToReplace.isAntiSpam) ||
      "None",
    isBotTrap:
      (preset.copyWhatToReplace && preset.copyWhatToReplace.isBotTrap) || false,
  });

  useEffect(() => {
    const savedPreset = JSON.parse(localStorage.getItem("presets") || "[]");
    const presetFromStorage = savedPreset.find(
      (p: Preset) => p.name === preset.name
    );

    if (presetFromStorage) {
      setStyles((prev) => ({ ...presetFromStorage.copyStyles, ...prev }));
      setReplaceOptions((prev) => ({
        ...presetFromStorage.copyWhatToReplace,
        ...prev,
      }));
    } else {
      setStyles((prev) => ({ ...preset.copyStyles, ...prev }));
      setReplaceOptions((prev) => ({ ...preset.copyWhatToReplace, ...prev }));
    }
  }, [preset]);

  const handleChange = (key: keyof CopyStyles, value: string) => {
    setStyles((prev) => ({ ...prev, [key]: value }));
  };

  const handlePaddingChange = (
    key: keyof CopyStyles["padding"],
    value: string
  ) => {
    setStyles((prev) => ({
      ...prev,
      padding: { ...prev.padding, [key]: value },
    }));
  };

  const handleReplaceToggle = (key: keyof CopyWhatToReplace) => {
    setReplaceOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    try {
      const savedPresets = JSON.parse(localStorage.getItem("presets") || "[]");
      const updatedPresets = savedPresets.map((p: Preset) =>
        p.name === preset.name
          ? { ...p, copyStyles: styles, copyWhatToReplace: replaceOptions }
          : p
      );

      const updatedStyles = { ...styles };
      const updatedReplaceOptions = { ...replaceOptions };

      if (
        (updatedReplaceOptions.isFontSize && updatedStyles.fontSize === "") ||
        (updatedReplaceOptions.isFontFamily &&
          updatedStyles.fontFamily === "") ||
        (updatedReplaceOptions.isBgColor && updatedStyles.bgColor === "") ||
        (updatedReplaceOptions.isLinkColor && updatedStyles.linkColor === "") ||
        (updatedReplaceOptions.isMaxWidth && updatedStyles.maxWidth === "") ||
        (updatedReplaceOptions.isLineHeight &&
          updatedStyles.lineHeight === "") ||
        (updatedReplaceOptions.isPadding.top &&
          updatedStyles.padding.top === "") ||
        (updatedReplaceOptions.isPadding.right &&
          updatedStyles.padding.right === "") ||
        (updatedReplaceOptions.isPadding.bottom &&
          updatedStyles.padding.bottom === "") ||
        (updatedReplaceOptions.isPadding.left &&
          updatedStyles.padding.left === "")
      ) {
        toastError("Error saving preset.");
        return;
      }
      localStorage.setItem("presets", JSON.stringify(updatedPresets));
      toastSuccess("Preset updated successfully.");
    } catch (error) {
      toastError("Error saving preset.");
    }
  };

  return (
    <Container>
      <LeftContainer>
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
            checked={replaceOptions.isFontSize}
            onChange={() => handleReplaceToggle("isFontSize")}
          />
          <InputContainer>
            <FloatingLabelInput
              placeholder="Font Size"
              value={styles.fontSize}
              onChange={(e) => handleChange("fontSize", e.target.value)}
            />
          </InputContainer>
        </InputGroup>

        <InputGroup>
          <StyledCheckbox
            type="checkbox"
            checked={replaceOptions.isBgColor}
            onChange={() => handleReplaceToggle("isBgColor")}
          />
          <InputContainer>
            <FloatingLabelInput
              placeholder="Background Color"
              value={styles.bgColor}
              onChange={(e) => handleChange("bgColor", e.target.value)}
            />
          </InputContainer>
        </InputGroup>

        <InputGroup>
          <StyledCheckbox
            type="checkbox"
            checked={replaceOptions.isLinkColor}
            onChange={() => handleReplaceToggle("isLinkColor")}
          />
          <InputContainer>
            <FloatingLabelInput
              placeholder="Link Color"
              value={styles.linkColor}
              onChange={(e) => handleChange("linkColor", e.target.value)}
            />
          </InputContainer>
        </InputGroup>

        <InputGroup>
          <StyledCheckbox
            type="checkbox"
            checked={replaceOptions.isMaxWidth}
            onChange={() => handleReplaceToggle("isMaxWidth")}
          />
          <InputContainer>
            <FloatingLabelInput
              placeholder="Max Width"
              value={styles.maxWidth}
              onChange={(e) => handleChange("maxWidth", e.target.value)}
            />
          </InputContainer>
        </InputGroup>

        <InputGroup>
          <StyledCheckbox
            type="checkbox"
            checked={replaceOptions.isLineHeight}
            onChange={() => handleReplaceToggle("isLineHeight")}
          />
          <InputContainer>
            <FloatingLabelInput
              placeholder="Line Height"
              value={styles.lineHeight}
              onChange={(e) => handleChange("lineHeight", e.target.value)}
            />
          </InputContainer>
        </InputGroup>
      </LeftContainer>

      <RightContainer>
        <InputGroup>
          <StyledCheckbox
            type="checkbox"
            checked={replaceOptions.isPadding.top}
            onChange={() =>
              setReplaceOptions((prev) => ({
                ...prev,
                isPadding: { ...prev.isPadding, top: !prev.isPadding.top },
              }))
            }
          />
          <InputContainer>
            <FloatingLabelInput
              placeholder="Top Padding"
              value={styles.padding.top}
              onChange={(e) => handlePaddingChange("top", e.target.value)}
            />
          </InputContainer>
        </InputGroup>

        <InputGroup>
          <StyledCheckbox
            type="checkbox"
            checked={replaceOptions.isPadding.bottom}
            onChange={() =>
              setReplaceOptions((prev) => ({
                ...prev,
                isPadding: {
                  ...prev.isPadding,
                  bottom: !prev.isPadding.bottom,
                },
              }))
            }
          />
          <InputContainer>
            <FloatingLabelInput
              placeholder="Bottom Padding"
              value={styles.padding.bottom}
              onChange={(e) => handlePaddingChange("bottom", e.target.value)}
            />
          </InputContainer>
        </InputGroup>

        <InputGroup>
          <StyledCheckbox
            type="checkbox"
            checked={replaceOptions.isPadding.left}
            onChange={() =>
              setReplaceOptions((prev) => ({
                ...prev,
                isPadding: { ...prev.isPadding, left: !prev.isPadding.left },
              }))
            }
          />
          <InputContainer>
            <FloatingLabelInput
              placeholder="Left Padding"
              value={styles.padding.left}
              onChange={(e) => handlePaddingChange("left", e.target.value)}
            />
          </InputContainer>
        </InputGroup>

        <InputGroup>
          <StyledCheckbox
            type="checkbox"
            checked={replaceOptions.isPadding.right}
            onChange={() =>
              setReplaceOptions((prev) => ({
                ...prev,
                isPadding: { ...prev.isPadding, right: !prev.isPadding.right },
              }))
            }
          />
          <InputContainer>
            <FloatingLabelInput
              placeholder="Right Padding"
              value={styles.padding.right}
              onChange={(e) => handlePaddingChange("right", e.target.value)}
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
              setReplaceOptions((prev) => ({
                ...prev,
                isAntiSpam: value as any,
              }))
            }
          />
        </InputGroup>
        <InputGroup>
          <SaveButton onClick={handleSave}>Save</SaveButton>
        </InputGroup>
      </RightContainer>
    </Container>
  );
};

export default StylesBlock;
