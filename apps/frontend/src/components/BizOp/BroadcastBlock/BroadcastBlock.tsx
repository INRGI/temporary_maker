import React, { useState, useEffect } from "react";
import { Preset } from "../../../types/bizop";
import { toastSuccess, toastError } from "../../../helpers/toastify";
import Dropdown from "../../Common/Dropdown/Dropdown";
import { Container, SaveButton, InputGroup } from "./BroadcastBlock.styled";
import FloatingLabelInput from "../../Common/FloatingLabelInput/FloatingLabelInput";
import axios from "axios";
import Loader from "../../Common/Loader";
import { SpanWhite, StyledCheckbox } from "../UnsubBlock/UnsubBlock.styled";

interface Props {
  preset: Preset;
}

const BroadcastBlock: React.FC<Props> = ({ preset }) => {
  const [domains, setDomains] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPreset, setCurrentPreset] = useState<Preset>(preset);

  const fetchDomains = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/bizop/broadcast/domains`);
      setDomains(response.data.domains || []);
    } catch (error) {
      toastError("Error fetching domains.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, [preset.broadcast]);

  const handleSave = () => {
    try {
      if (!currentPreset.broadcast || !currentPreset.name) {
        toastError("All data required");
        return;
      }
      const savedPresets = JSON.parse(
        localStorage.getItem("bizop-presets") || "[]"
      );
      const updatedPresets = savedPresets.map((p: Preset) =>
        p.name === preset.name
          ? {
              ...p,
              broadcast: currentPreset.broadcast,
              name: currentPreset.name,
              format: currentPreset.format || "html",
            }
          : p
      );

      localStorage.setItem("bizop-presets", JSON.stringify(updatedPresets));
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

      {domains.length > 0 && (
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
        <StyledCheckbox
          type="checkbox"
          checked={currentPreset.format === "mjml"}
          onChange={(e) =>
            setCurrentPreset({
              ...currentPreset,
              format: e.target.checked ? "mjml" : "html",
            })
          }
        />
        <SpanWhite>Use mjml? [EXPERIMENTAL]</SpanWhite>
      </InputGroup>

      <InputGroup>
        <SaveButton onClick={handleSave}>Save</SaveButton>
      </InputGroup>
    </Container>
  );
};

export default BroadcastBlock;
