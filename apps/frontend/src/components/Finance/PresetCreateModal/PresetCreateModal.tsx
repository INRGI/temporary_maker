import { useState, useEffect } from "react";
import AdminModal from "../../Common/AdminModal";
import { Preset, Broadcast } from "../../../types";
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
          {loading && <CenterContainer><SmallLoader /></CenterContainer>}
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

          <SaveButton onClick={handleSavePreset}>Save</SaveButton>
        </Container>
      </CreatePresetContainer>
    </AdminModal>
  );
};

export default PresetCreateModal;
