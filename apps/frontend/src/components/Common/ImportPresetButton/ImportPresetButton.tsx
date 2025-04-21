import React, { useRef } from "react";
import { toastError } from "../../../helpers/toastify";
import { FaUpload } from "react-icons/fa6";
import { HiddenInput, ImportButton } from "./ImportPresetButton.styled";

interface ImportPresetButtonProps<T> {
  onImport: (preset: T) => void;
  validate?: (data: any) => data is T;
}

function ImportPresetButton<T>({
  onImport,
  validate,
}: ImportPresetButtonProps<T>) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);

        if (validate && !validate(parsed)) {
          throw new Error("Invalid format");
        }

        onImport(parsed);
      } catch {
        toastError("Failed to import preset");
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <ImportButton onClick={handleClick}>
        <FaUpload size={16} />
      </ImportButton>
      <HiddenInput
        type="file"
        accept="application/json"
        ref={fileInputRef}
        onChange={handleImport}
      />
    </>
  );
}

export default ImportPresetButton;
