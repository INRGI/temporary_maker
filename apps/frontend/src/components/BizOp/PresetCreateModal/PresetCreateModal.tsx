/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import AdminModal from "../../Common/AdminModal";
import { Preset } from "../../../types/bizop";
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
import ImportPresetButton from "../../Common/ImportPresetButton/ImportPresetButton";
import { SpanWhite, StyledCheckbox } from "../UnsubBlock/UnsubBlock.styled";

interface PresetCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: Preset | null;
}

const PresetCreateModal: React.FC<PresetCreateModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [presetData, setPresetData] = useState<Preset>(
    initialData || {
      name: "",
      broadcast: { domain: "" },
      format: "html",
    }
  );

  const [domains, setDomains] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDomains();
  }, [presetData.broadcast]);

  const fetchDomains = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/bizop/broadcast/domains`);
      setDomains(response.data.domains);
    } catch (error) {
      toastError("Error fetching domains.");
    }
    setLoading(false);
  };

  const handleSavePreset = () => {
    if (!presetData.name || !presetData.broadcast.domain) {
      toastError("Please fill in all fields.");
      return;
    }

    try {
      const savedPresets: Preset[] = JSON.parse(
        localStorage.getItem("bizop-presets") || "[]"
      );

      const isDuplicate = savedPresets.some(
        (preset) => preset.name.toLowerCase() === presetData.name.toLowerCase()
      );

      if (isDuplicate) {
        toastError("A preset with this name already exists.");
        return;
      }

      localStorage.setItem(
        "bizop-presets",
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
        localStorage.getItem("bizop-presets") || "[]"
      );

      const isDuplicate = savedPresets.some(
        (preset) => preset.name.toLowerCase() === imported.name.toLowerCase()
      );

      if (isDuplicate) {
        toastError("A preset with this name already exists.");
        return;
      }

      const updatedPresets = [...savedPresets, imported];
      localStorage.setItem("bizop-presets", JSON.stringify(updatedPresets));
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

          {loading && (
            <CenterContainer>
              <SmallLoader />
            </CenterContainer>
          )}
          {domains.length > 0 && (
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
