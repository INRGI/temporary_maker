import React, { useState, useEffect } from "react";
import { Preset, Broadcast } from "../../types";
import { toastSuccess, toastError } from "../../helpers/toastify";
import Dropdown from "../Dropdown/Dropdown";
import { Container, SaveButton, InputGroup } from "./BroadcastBlock.styled";
import FloatingLabelInput from "../FloatingLabelInput/FloatingLabelInput";
import axios from "axios";
import Loader from "../Loader";

interface Props {
  preset: Preset;
}

const teams: Broadcast["team"][] = [
  "Blue",
  "Red",
  "Green",
  "Purple",
  "Jade",
  "Tiffany",
  "Orange",
];

const BroadcastBlock: React.FC<Props> = ({ preset }) => {
  const [domains, setDomains] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPreset, setCurrentPreset] = useState<Preset>(preset);

  const fetchDomains = async (team: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/broadcast/${team}`);
      setDomains(response.data.domains || []);
    } catch (error) {
      toastError("Error fetching domains.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentPreset.broadcast.team && currentPreset.broadcast.team !== "Select Team") {
      fetchDomains(currentPreset.broadcast.team);
    }
  }, [currentPreset.broadcast.team]);

  const handleSave = () => {
    try {
      if (!currentPreset.broadcast || !currentPreset.name) {
        toastError("All data required");
        return;
      }
      const savedPresets = JSON.parse(localStorage.getItem("presets") || "[]");
      const updatedPresets = savedPresets.map((p: Preset) =>
        p.name === preset.name
          ? { ...p, broadcast: currentPreset.broadcast, name: currentPreset.name }
          : p
      );

      localStorage.setItem("presets", JSON.stringify(updatedPresets));
      toastSuccess("Preset updated successfully.");
    } catch (error) {
      toastError("Error saving preset.");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <InputGroup>
        <FloatingLabelInput
          value={currentPreset.name}
          onChange={(e) =>
            setCurrentPreset({ ...currentPreset, name: e.target.value })
          }
          placeholder="Preset Name"
        />
      </InputGroup>

      <InputGroup>
        <Dropdown
          placeholder="Team"
          options={teams}
          selected={currentPreset.broadcast.team}
          onSelect={(team) =>
            setCurrentPreset({
              ...currentPreset,
              broadcast: {
                ...currentPreset.broadcast,
                team: team as Broadcast["team"],
              },
            })
          }
        />
      </InputGroup>

      {currentPreset.broadcast.team !== "Select Team" && domains.length > 0 && (
        <InputGroup>
          <Dropdown
            placeholder="Domain"
            options={domains}
            selected={currentPreset.broadcast.domain}
            onSelect={(domain) =>
              setCurrentPreset({
                ...currentPreset,
                broadcast: { ...currentPreset.broadcast, domain },
              })
            }
          />
        </InputGroup>
      )}

      <InputGroup>
        <SaveButton onClick={handleSave}>Save</SaveButton>
      </InputGroup>
    </Container>
  );
};

export default BroadcastBlock;
