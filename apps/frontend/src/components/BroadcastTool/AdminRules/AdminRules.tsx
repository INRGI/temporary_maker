import React, { useEffect, useRef, useState } from "react";
import {
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
import { getAdminBroadcastConfigByNiche } from "../../../api/admin-broadcast-config.api";
import { toastError } from "../../../helpers/toastify";

const AdminRules: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [adminBroadcastConfig, setAdminBroadcastConfig] =
    useState<AdminBroadcastConfigEntity>();
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [isLoading, setIsLoading] = useState(false);

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
    <ListScrollContainer>
      {isLoading && <Loader />}

      {!isLoading &&
        adminBroadcastConfig &&
        renderSection(
          "Analytic Selection Rules",
          "analyticSelectionRules",
          <AnalyticSelectionRulesTab
            analyticSelectionRules={adminBroadcastConfig.analyticSelectionRules}
            onChange={(updated) =>
              handleChange("analyticSelectionRules", updated)
            }
          />
        )}
    </ListScrollContainer>
  );
};

export default AdminRules;
