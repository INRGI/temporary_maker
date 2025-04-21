/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import AdminModal from "../../Common/AdminModal";
import { Preset, Broadcast } from "../../../types/finance";
import { toastError, toastSuccess } from "../../../helpers/toastify";
import {
  BlockHeader,
  CenterContainer,
  Container,
  CreatePresetContainer,
  SaveButton,
} from "./PresetCreateModal.styled";
import FloatingLabelInput from "../../Common/FloatingLabelInput/FloatingLabelInput";
import axios from "axios";
import Dropdown from "../../Common/Dropdown/Dropdown";
import { SmallLoader } from "../../Common/Loader";
import { InputGroup } from "../StylesBlock/StylesBlock.styled";
import { SpanWhite, StyledCheckbox } from "../UnsubBlock/UnsubBlock.styled";
import ImportPresetButton from "../../Common/ImportPresetButton/ImportPresetButton";

interface PresetCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: Preset | null;
}

const teams: Broadcast["team"][] = [
  "Blue",
  "Warsaw",
  "Red",
  "Green",
  "Purple",
  "Jade",
  "Tiffany",
  "Orange",
];

const PresetCreateModal: React.FC<PresetCreateModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [presetData, setPresetData] = useState<Preset>(
    initialData || {
      name: "",
      broadcast: { team: "Select Team", domain: "" },
      format: "html",
    }
  );

  const [domains, setDomains] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (presetData.broadcast.team !== "Select Team") {
      fetchDomains(presetData.broadcast.team);
    }
  }, [presetData.broadcast.team]);

  const fetchDomains = async (team: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/finances/broadcast/${team}`);
      setDomains(response.data.domains);
    } catch (error) {
      toastError("Error fetching domains.");
    }
    setLoading(false);
  };

  const handleSavePreset = () => {
    if (
      !presetData.name ||
      !presetData.broadcast.domain ||
      presetData.broadcast.team === "Select Team"
    ) {
      toastError("Please fill in all fields.");
      return;
    }

    try {
      const savedPresets: Preset[] = JSON.parse(
        localStorage.getItem("presets") || "[]"
      );

      const isDuplicate = savedPresets.some(
        (preset) => preset.name.toLowerCase() === presetData.name.toLowerCase()
      );

      if (isDuplicate) {
        toastError("A preset with this name already exists.");
        return;
      }

      localStorage.setItem(
        "presets",
        JSON.stringify([...savedPresets, presetData])
      );
      toastSuccess("Preset saved successfully.");
      onClose();
    } catch (error) {
      toastError("Error saving preset.");
    }
  };

  const handleImportedPreset = (imported: Preset) => {
    try {
      const savedPresets: Preset[] = JSON.parse(
        localStorage.getItem("presets") || "[]"
      );
  
      const isDuplicate = savedPresets.some(
        (preset) => preset.name.toLowerCase() === imported.name.toLowerCase()
      );
  
      if (isDuplicate) {
        toastError("A preset with this name already exists.");
        return;
      }
  
      const updatedPresets = [...savedPresets, imported];
      localStorage.setItem("presets", JSON.stringify(updatedPresets));
      toastSuccess("Preset imported and saved.");
      onClose();
    } catch (error) {
      toastError("Failed to import preset.");
    }
  };
  
  return (
    <AdminModal isOpen={isOpen} onClose={onClose}>
      <CreatePresetContainer>
        <BlockHeader>
          <h2>Create Preset</h2>
          <ImportPresetButton onImport={handleImportedPreset} />
        </BlockHeader>
        <Container>
          <FloatingLabelInput
            value={presetData.name}
            onChange={(e) =>
              setPresetData({ ...presetData, name: e.target.value })
            }
            placeholder="Preset Name"
          />

          <Dropdown
            placeholder="Broadcast"
            options={teams}
            selected={presetData.broadcast.team}
            onSelect={(team) =>
              setPresetData({
                ...presetData,
                broadcast: {
                  ...presetData.broadcast,
                  team: team as Broadcast["team"],
                },
              })
            }
          />
          {loading && (
            <CenterContainer>
              <SmallLoader />
            </CenterContainer>
          )}
          {presetData.broadcast.team !== "Select Team" &&
            domains.length > 0 && (
              <Dropdown
                placeholder="Domain"
                options={domains}
                selected={presetData.broadcast.domain}
                onSelect={(domain) =>
                  setPresetData({
                    ...presetData,
                    broadcast: { ...presetData.broadcast, domain },
                  })
                }
              />
            )}

          <InputGroup style={{ width: "100%", maxWidth: `calc(100% - 25px)` }}>
            <StyledCheckbox
              type="checkbox"
              checked={presetData.format === "mjml"}
              onChange={(e) =>
                setPresetData({
                  ...presetData,
                  format: e.target.checked ? "mjml" : "html",
                })
              }
            />
            <SpanWhite>Use mjml? [EXPERIMENTAL]</SpanWhite>
          </InputGroup>

          <SaveButton onClick={handleSavePreset}>Save</SaveButton>
        </Container>
      </CreatePresetContainer>
    </AdminModal>
  );
};

export default PresetCreateModal;
