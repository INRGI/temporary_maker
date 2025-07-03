import React, { useState, useEffect } from "react";
import { SubjectLine, Preset } from "../../../types/organic";
import { toastSuccess, toastError } from "../../../helpers/toastify";
import Dropdown from "../../Common/Dropdown/Dropdown";
import {
  Container,
  SaveButton,
  InputGroup,
  StyledCheckbox,
} from "./SubjectBlock.styled";

interface Props {
  preset: Preset;
}

const antiSpamOptions = ['Default', 'Full Anti Spam', 'Spam Words Only'];

const SubjectBlock: React.FC<Props> = ({ preset }) => {
  const [subject, setSubject] = useState<SubjectLine>({
    isSubjectLine: preset?.subjectLine && preset.subjectLine?.isSubjectLine || false,
    subjectLine: preset?.subjectLine && preset.subjectLine?.subjectLine || 'Default',
  });

  useEffect(() => {
    const savedPreset = JSON.parse(localStorage.getItem("organic-presets") || "[]");
    const presetFromStorage = savedPreset.find(
      (p: Preset) => p.name === preset.name
    );

    if (presetFromStorage) {
      setSubject((prev) => ({ ...presetFromStorage.subjectLine, ...prev }));
    } else {
      setSubject((prev) => ({ ...preset.subjectLine, ...prev }));
    }
  }, [preset]);

  const handleChange = (key: keyof SubjectLine, value: string | boolean) => {
    setSubject((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    try {
      const savedPresets = JSON.parse(localStorage.getItem("organic-presets") || "[]");
      const updatedPresets = savedPresets.map((p: Preset) =>
        p.name === preset.name
          ? { ...p, subjectLine: subject }
          : p
      );

      localStorage.setItem("organic-presets", JSON.stringify(updatedPresets));
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
            checked={subject.isSubjectLine}
            onChange={() =>
              handleChange("isSubjectLine", !subject.isSubjectLine)
            }
          />
          <Dropdown
            placeholder="Select Anti Spam"
            options={antiSpamOptions}
            selected={subject.subjectLine || "None"}
            onSelect={(value) =>
              handleChange("subjectLine", value as string)
            }
          />
        </InputGroup>
        <InputGroup>
          <SaveButton onClick={handleSave}>Save</SaveButton>
        </InputGroup>
    </Container>
  );
};

export default SubjectBlock;
