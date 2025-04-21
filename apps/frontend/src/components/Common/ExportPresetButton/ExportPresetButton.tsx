import { FaDownload } from "react-icons/fa6";
import React from "react";
import { Preset } from "../../../types/finance";
import { Preset as HealthPreset } from "../../../types/health";
import { ExportButton } from "./ExportPresetButton.styled";

interface ExportPresetButtonProps {
  preset: Preset | HealthPreset;
}

const ExportPresetButton: React.FC<ExportPresetButtonProps> = ({ preset }) => {
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(preset, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${preset.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ExportButton onClick={handleExport}>
      <FaDownload size={16} />
    </ExportButton>
  );
};

export default ExportPresetButton;
