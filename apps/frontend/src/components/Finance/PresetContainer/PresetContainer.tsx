import { useEffect, useState } from "react";
import { Preset } from "../../../types";
import {
  Button,
  Container,
  DeleteButton,
  DublicateButton,
  EditButton,
  HeaderContainer,
  PresetCard,
  PresetsContainer,
  RootContainer,
  ServicesBlockHeader,
} from "./PresetContainer.styled";
import { FaPlus } from "react-icons/fa";
import SearchInput from "../../Common/SearchInput/SearchInput";
import PresetCreateModal from "../PresetCreateModal/PresetCreateModal";
import PresetUpdateModal from "../PresetUpdateModal/PresetUpdateModal";
import CopyMaker from "../CopyMaker/CopyMaker";
import { toastError, toastSuccess } from "../../../helpers/toastify";
import { FaRegCopy } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";

const PresetContainer: React.FC = () => {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [searchText, setSearchText] = useState("");
  const [presetCreateModalOpen, setPresetCreateModalOpen] = useState(false);
  const [presetEditModalOpen, setPresetEditModalOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);

  const [activePreset, setActivePreset] = useState<Preset | null>(null);
  const getPresets = async () => {
    const savedPresets = JSON.parse(localStorage.getItem("presets") || "[]");
    setPresets(savedPresets);
  };

  useEffect(() => {
    getPresets();
  }, []);

  useEffect(() => {
    if (presets.length && activePreset) {
      setActivePreset(
        presets.filter((preset) => preset.name === activePreset.name)[0]
      );
    }
  }, [presets]);

  const handleDeletePreset = async (preset: Preset) => {
    const savedPresets = JSON.parse(localStorage.getItem("presets") || "[]");
    const updatedPresets = savedPresets.filter(
      (p: Preset) => p.name !== preset.name
    );
    localStorage.setItem("presets", JSON.stringify(updatedPresets));
    getPresets();
    toastSuccess("Preset deleted successfully");
  };

  const handleDuplicatePreset = async (preset: Preset) => {
    const presets = JSON.parse(localStorage.getItem("presets") || "[]");
    const newPresetName = `${preset.name}_copy`;
    const existingPreset = presets.find(
      (p: Preset) => p.name === newPresetName
    );

    if (existingPreset) {
      toastError("Preset with this name already exists");
      return;
    }

    const newPreset = { ...preset, name: newPresetName };
    presets.push(newPreset);
    localStorage.setItem("presets", JSON.stringify(presets));
    getPresets();
    toastSuccess("Preset duplicated successfully");
  };

  const handleUpdatePreset = async (preset: Preset) => {
    setSelectedPreset(preset);
    setPresetEditModalOpen(true);
  };

  const handleCloseModal = async () => {
    setPresetCreateModalOpen(false);
    setPresetEditModalOpen(false);
    await getPresets();
  };

  const filteredPresets = presets.filter((preset) =>
    preset.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <RootContainer>
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
              <PresetCard
                key={preset.name}
                onClick={() => setActivePreset(preset)}
                isActive={activePreset?.name === preset.name}
              >
                <h2>{preset.name}</h2>
                <div>
                  <DublicateButton
                    onClick={() => handleDuplicatePreset(preset)}
                  >
                    <FaRegCopy />
                  </DublicateButton>
                  <EditButton onClick={() => handleUpdatePreset(preset)}>
                  <MdEdit />
                  </EditButton>
                  <DeleteButton onClick={() => handleDeletePreset(preset)}>
                  <MdDeleteForever />
                  </DeleteButton>
                </div>
              </PresetCard>
            ))
          ) : (
            <PresetCard isActive={false}>
              Presets not found. Create one
            </PresetCard>
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

      {activePreset && <CopyMaker preset={activePreset} />}
    </RootContainer>
  );
};

export default PresetContainer;
