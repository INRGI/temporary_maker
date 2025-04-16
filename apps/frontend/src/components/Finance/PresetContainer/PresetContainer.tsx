import { useEffect, useState } from "react";
import { Preset } from "../../../types/finance";
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
import { FaPlus, FaRegCopy } from "react-icons/fa6";
import { MdEdit, MdDeleteForever } from "react-icons/md";
import { LiaGripVerticalSolid } from "react-icons/lia";
import SearchInput from "../../Common/SearchInput/SearchInput";
import PresetCreateModal from "../PresetCreateModal/PresetCreateModal";
import PresetUpdateModal from "../PresetUpdateModal/PresetUpdateModal";
import CopyMaker from "../CopyMaker/CopyMaker";
import { toastError, toastSuccess } from "../../../helpers/toastify";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortablePresetCard = ({
  preset,
  activePreset,
  onClick,
  children,
}: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: preset.name,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: "flex",
    alignItems: "center",
  };

  return (
    <PresetCard
      ref={setNodeRef}
      style={style}
      isActive={activePreset?.name === preset.name}
      onClick={() => onClick(preset)}
    >
      <div
        {...attributes}
        {...listeners}
        style={{ cursor: "grab", paddingRight: 10 }}
      >
        <LiaGripVerticalSolid size={20} />
      </div>
      {children}
    </PresetCard>
  );
};

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
        presets.find((preset) => preset.name === activePreset.name) || null
      );
    }
  }, [presets]);

  const handleDeletePreset = async (preset: Preset) => {
    const updatedPresets = presets.filter((p) => p.name !== preset.name);
    localStorage.setItem("presets", JSON.stringify(updatedPresets));
    setPresets(updatedPresets);
    toastSuccess("Preset deleted successfully");
  };

  const handleDuplicatePreset = async (preset: Preset) => {
    const newPresetName = `${preset.name}_copy`;
    if (presets.some((p) => p.name === newPresetName)) {
      toastError("Preset with this name already exists");
      return;
    }
    const newPreset = { ...preset, name: newPresetName };
    const updatedPresets = [...presets, newPreset];
    localStorage.setItem("presets", JSON.stringify(updatedPresets));
    setPresets(updatedPresets);
    toastSuccess("Preset duplicated successfully");
  };

  const handleUpdatePreset = (preset: Preset) => {
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

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = filteredPresets.findIndex((p) => p.name === active.id);
      const newIndex = filteredPresets.findIndex((p) => p.name === over?.id);
      const newOrder = arrayMove(filteredPresets, oldIndex, newIndex);
      setPresets(newOrder);
      localStorage.setItem("presets", JSON.stringify(newOrder));
    }
  };

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
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search presets by name"
        />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredPresets.map((p) => p.name)}
            strategy={verticalListSortingStrategy}
          >
            <PresetsContainer>
              {filteredPresets.length ? (
                filteredPresets.map((preset) => (
                  <SortablePresetCard
                    key={preset.name}
                    preset={preset}
                    activePreset={activePreset}
                    onClick={setActivePreset}
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
                  </SortablePresetCard>
                ))
              ) : (
                <PresetCard isActive={false}>
                  Presets not found. Create one
                </PresetCard>
              )}
            </PresetsContainer>
          </SortableContext>
        </DndContext>

        {presetCreateModalOpen && (
          <PresetCreateModal
            isOpen={presetCreateModalOpen}
            onClose={handleCloseModal}
            initialData={null}
          />
        )}

        {presetEditModalOpen && selectedPreset && (
          <PresetUpdateModal
            isOpen={presetEditModalOpen}
            onClose={handleCloseModal}
            preset={selectedPreset}
          />
        )}
      </Container>

      {activePreset && <CopyMaker preset={activePreset} />}
    </RootContainer>
  );
};

export default PresetContainer;
