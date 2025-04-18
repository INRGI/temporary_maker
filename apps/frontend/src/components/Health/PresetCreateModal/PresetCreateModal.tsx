import { useState, useEffect } from "react";
import AdminModal from "../../Common/AdminModal";
import { Preset } from "../../../types/health";
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
import {
  InputGroup,
  SpanWhite,
  StyledCheckbox,
} from "../UnsubBlock/UnsubBlock.styled";

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
    }
  );

  const [domains, setDomains] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/health/broadcast`);
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
        localStorage.getItem("health-presets") || "[]"
      );

      const isDuplicate = savedPresets.some(
        (preset) => preset.name.toLowerCase() === presetData.name.toLowerCase()
      );

      if (isDuplicate) {
        toastError("A preset with this name already exists.");
        return;
      }

      localStorage.setItem(
        "health-presets",
        JSON.stringify([...savedPresets, presetData])
      );
      toastSuccess("Preset saved successfully.");
      onClose();
    } catch (error) {
      toastError("Error saving preset.");
    }
  };

  return (
    <AdminModal isOpen={isOpen} onClose={onClose}>
      <CreatePresetContainer>
        <BlockHeader>
          <h2>Create Preset</h2>
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
          {domains && domains.length > 0 && (
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
