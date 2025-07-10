import React, { useEffect, useRef, useState } from "react";
import {
  ButtonsHeaderContainer,
  ListScrollContainer,
  Section,
  SectionContentWrapper,
  SectionHeader,
  SectionInner,
} from "./AdminRules.styled";
import { AdminBroadcastConfigEntity } from "../../../types/broadcast-tool";
import { FiMinus, FiPlus } from "react-icons/fi";
import Loader from "../../Common/Loader";
import AnalyticSelectionRulesTab from "../AnalyticSelectionRulesTab";
import {
  getAdminBroadcastConfigByNiche,
  updateAdminBroadcastConfig,
} from "../../../api/admin-broadcast-config.api";
import { toastError, toastSuccess } from "../../../helpers/toastify";
import { LiaSaveSolid } from "react-icons/lia";
import ConfirmationModal from "../ConfirmationModal";
import { Button } from "../Menu/Menu.styled";
import TestingRulesTab from "../TestingRulesTab";

const AdminRules: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [adminBroadcastConfig, setAdminBroadcastConfig] =
    useState<AdminBroadcastConfigEntity>();
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    Promise.allSettled([fetchAdminBroadcastConfig()]).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const fetchAdminBroadcastConfig = async () => {
    try {
      const response = await getAdminBroadcastConfigByNiche("finance");
      if (!response) {
        toastError("Failed to fetch admin broadcast config");
        return;
      }
      setAdminBroadcastConfig(response);
    } catch (error) {
      toastError("Failed to fetch admin broadcast config");
      setAdminBroadcastConfig(undefined);
    }
  };

  const handleChange = <K extends keyof AdminBroadcastConfigEntity>(
    key: K,
    value: AdminBroadcastConfigEntity[K]
  ) => {
    if (!adminBroadcastConfig) return;

    setAdminBroadcastConfig({
      ...adminBroadcastConfig,
      [key]: value,
    });
  };

  const toggleSection = (key: string) => {
    setOpenSection((prev) => (prev === key ? null : key));
  };

  const onEntityUpdate = () => {
    setIsLoading(true);
    Promise.allSettled([fetchAdminBroadcastConfig()]).finally(() => {
      setIsLoading(false);
    });
    setIsUpdateModalOpen(false);
  };

  const handleUpdateEntity = async () => {
    try {
      if (!adminBroadcastConfig) return toastError("Failed to update config");
      setIsLoading(true);
      await updateAdminBroadcastConfig(adminBroadcastConfig);
      toastSuccess("Config updated successfully");
      setIsLoading(false);
    } catch (error) {
      toastError("Failed to update Config");
      setIsLoading(false);
    } finally {
      onEntityUpdate();
    }
  };

  const renderSection = (
    label: string,
    key: keyof AdminBroadcastConfigEntity,
    component: React.ReactNode
  ) => (
    <Section>
      <SectionHeader
        active={openSection === label}
        onClick={() => toggleSection(label)}
      >
        {label}
        {openSection === label ? <FiMinus size={18} /> : <FiPlus size={18} />}
      </SectionHeader>
      <SectionContentWrapper isOpen={openSection === label}>
        <SectionInner ref={(el) => (contentRefs.current[label] = el)}>
          {component}
        </SectionInner>
      </SectionContentWrapper>
    </Section>
  );

  return (
    <>
      <ButtonsHeaderContainer>
        <Button onClick={() => setIsUpdateModalOpen(true)}>
          <LiaSaveSolid />
        </Button>
      </ButtonsHeaderContainer>
      <ListScrollContainer>
        {isLoading && <Loader />}

        {!isLoading &&
          adminBroadcastConfig &&
          renderSection(
            "Analytic Selection Rules",
            "analyticSelectionRules",
            <AnalyticSelectionRulesTab
              analyticSelectionRules={
                adminBroadcastConfig.analyticSelectionRules
              }
              onChange={(updated) =>
                handleChange("analyticSelectionRules", updated)
              }
            />
          )}

        {!isLoading &&
          adminBroadcastConfig &&
          renderSection(
            "Testing Rules",
            "testingRules",
            <TestingRulesTab
              testingRules={adminBroadcastConfig.testingRules}
              onChange={(updated) => handleChange("testingRules", updated)}
            />
          )}
      </ListScrollContainer>
      {isUpdateModalOpen && (
        <ConfirmationModal
          title="Update Broadcast Rules"
          message="Are you sure you want to update the config?"
          confirmButtonText="Update"
          cancelButtonText="Cancel"
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
          }}
          onConfirm={handleUpdateEntity}
        />
      )}
    </>
  );
};

export default AdminRules;
