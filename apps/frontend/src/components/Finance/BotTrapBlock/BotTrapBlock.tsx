import React, { useState, useEffect } from "react";
import { Preset, BotTrap } from "../../../types";
import { toastSuccess, toastError } from "../../../helpers/toastify";
import Dropdown from "../../Common/Dropdown/Dropdown";
import {
  Container,
  SaveButton,
  InputGroup,
  StyledCheckbox,
  InputContainer,
} from "./BotTrapBlock.styled";
import FloatingLabelInput from "../../Common/FloatingLabelInput/FloatingLabelInput";

interface Props {
  preset: Preset;
}

const botTrapOptions: BotTrap["type"][] = [
  "first-spec-symbol",
  "last-spec-symbol",
  "first-word-first-sentence",
  "last-word-first-sentence",
  "first-word-last-sentence",
  "last-word-last-sentence",
];

const BotTrapBlock: React.FC<Props> = ({ preset }) => {
  const [botTrap, setBotTrap] = useState<BotTrap>({
    url: preset?.botTrap?.url || "",
    type: preset?.botTrap?.type || "first-spec-symbol",
  });

  const [isBotTrap, setIsBotTrap] = useState(
    preset?.copyWhatToReplace?.isBotTrap || false
  );

  useEffect(() => {
    const savedPreset = JSON.parse(localStorage.getItem("presets") || "[]");
    const presetFromStorage = savedPreset.find(
      (p: Preset) => p.name === preset.name
    );

    if (presetFromStorage?.copyWhatToReplace?.botTrap) {
      setBotTrap(presetFromStorage.copyWhatToReplace.botTrap);
      setIsBotTrap(presetFromStorage.copyWhatToReplace.isBotTrap);
    }
  }, [preset]);

  const handleChange = (key: keyof BotTrap, value: string) => {
    setBotTrap((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    try {
      if(isBotTrap && !botTrap.url) {
        toastError("Bot trap URL is required.");
        return 
      }
      const savedPresets = JSON.parse(localStorage.getItem("presets") || "[]");
      const updatedPresets = savedPresets.map((p: Preset) =>
        p.name === preset.name
          ? {
              ...p,
              copyWhatToReplace: {
                ...p.copyWhatToReplace,
                isBotTrap,
              },
              botTrap
            }
          : p
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
          checked={isBotTrap}
          onChange={() => setIsBotTrap((prev) => !prev)}
        />
        <Dropdown
          placeholder="Select bot trap"
          options={botTrapOptions}
          selected={botTrap.type}
          onSelect={(value) => handleChange("type", value as string)}
        />
      </InputGroup>

      <InputGroup>
        <InputContainer>
          <FloatingLabelInput
            placeholder="Bot Trap URL"
            value={botTrap.url}
            onChange={(e) => handleChange("url", e.target.value)}
          />
        </InputContainer>
      </InputGroup>

      <InputGroup>
        <SaveButton onClick={handleSave}>Save</SaveButton>
      </InputGroup>
    </Container>
  );
};

export default BotTrapBlock;