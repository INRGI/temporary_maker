import { useEffect, useState } from "react";
import { Preset } from "../../types";
import {
  Button,
  Container,
  DeleteButton,
  EditButton,
  HeaderContainer,
  PresetCard,
  PresetsContainer,
  ServicesBlockHeader,
} from "./PresetContainer.styled";
import { FaPlus } from "react-icons/fa";
import SearchInput from "../SearchInput/SearchInput";
import PresetCreateModal from "../PresetCreateModal/PresetCreateModal";
import PresetUpdateModal from "../PresetUpdateModal/PresetUpdateModal";

const PresetContainer: React.FC = () => {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [searchText, setSearchText] = useState("");
  const [presetCreateModalOpen, setPresetCreateModalOpen] = useState(false);
  const [presetEditModalOpen, setPresetEditModalOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);

  const getPresets = async () => {
    const savedPresets = JSON.parse(localStorage.getItem("presets") || "[]");
    setPresets(savedPresets);
  };

  useEffect(() => {
    getPresets();
  }, []);

  const handleDeletePreset = async () => {};

  const handleUpdatePreset = async (preset: Preset) => {
    setSelectedPreset(preset);
    setPresetEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setPresetCreateModalOpen(false);
    setPresetEditModalOpen(false);
    getPresets();
  };

  const filteredPresets = presets.filter((preset) =>
    preset.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Container>
      <HeaderContainer>
        <ServicesBlockHeader>
          <h2>Presets</h2>
          <p>All presets below</p>
        </ServicesBlockHeader>
        <Button onClick={() => setPresetCreateModalOpen(true)}>
          <FaPlus />
        </Button>
      </HeaderContainer>
      <SearchInput
        value={searchText || ""}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Search presets by name"
      />
      <PresetsContainer>
        {filteredPresets?.length > 0 ? (
          filteredPresets.map((preset) => (
            <PresetCard key={preset.name}>
              <h2>{preset.name}</h2>
              <div>
                <EditButton onClick={() => handleUpdatePreset(preset)}>Styles</EditButton>
                <DeleteButton onClick={() => handleDeletePreset()}>
                  Delete
                </DeleteButton>
              </div>
            </PresetCard>
          ))
        ) : (
          <PresetCard>No presets available.</PresetCard>
        )}
      </PresetsContainer>

      {presetCreateModalOpen && (
        <PresetCreateModal
          isOpen={presetCreateModalOpen}
          onClose={() => {
            handleCloseModal();
          }}
          initialData={null}
        />
      )}
      {presetEditModalOpen && selectedPreset && (
        <PresetUpdateModal
          isOpen={presetEditModalOpen}
          onClose={() => {
            handleCloseModal();
          }}
          preset={selectedPreset}
        />
      )}
    </Container>
  );
};

export default PresetContainer;
