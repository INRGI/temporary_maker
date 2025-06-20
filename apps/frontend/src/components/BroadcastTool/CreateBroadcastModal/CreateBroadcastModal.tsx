import { useEffect, useState } from "react";
import AdminModal from "../../Common/AdminModal";
import {
  BlockHeader,
  Container,
  CreateContainer,
  TabButton,
  TabsContainer,
} from "./CreateBroadcastModal.styled";
import { CreateBroadcastRulesRequest } from "../../../api/broadcast-rules";
import DomainRulesTab from "../DomainRulesTab";
import Loader from "../../Common/Loader";
import { toastError, toastSuccess } from "../../../helpers/toastify";
import { getDomainStatuses, getProductStatuses } from "../../../api/monday.api";
import {
  GetDomainStatusesResponse,
  GetProductStatusesResponse,
} from "../../../api/monday";
import UsageRulesTab from "../UsageRulesTab";
import TestingRulesTab from "../TestingRulesTab";
import PartnerRulesTab from "../PartnerRulesTab";
import ProductRulesTab from "../ProductRulesTab";
import AnalyticSelectionRulesTab from "../AnalyticSelectionRulesTab";
import CopyAssignmentStrategyRulesTab from "../CopyAssignmentStrategyRulesTab";
import { BroadcastListItemResponse } from "../../../api/broadcast/response/broadcast-list-item.response.dto";
import { getBroadcastsList } from "../../../api/broadcast.api";
import GeneralTab from "../GeneralTab";
import { createBroadcastRules } from "../../../api/broadcast-rules.api";
import ConfirmCreateModal from "../ConfirmCreateModal";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateBroadcastModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState("domain-rules");
  const [broadcastRules, setBroadcastRules] =
    useState<CreateBroadcastRulesRequest>({
      name: "",
      broadcastSpreadsheetId: "",
      domainRules: {
        minClicksToBeLive: 0,
        avarageClicksDays: 0,
        allowedMondayStatuses: [],
      },
      usageRules: {
        productMinDelayPerDays: 0,
        copyMinDelayPerDays: 0,
        generalTabCopyLimit: 0,
      },
      testingRules: {
        maxTestCopiesForDomain: 0,
        maxClicksToBeTestCopy: 0,
      },
      partnerRules: {
        useNewPartnerForClickableCopies: false,
        allowedIspsForNewPartners: [],
        daysSendingForNewPartners: 0,
      },
      productRules: {
        blacklistedCopies: [],
        minConversionForClickableCopy: 0,
        allowSimilarCopies: false,
        allowedMondayStatuses: [],
        productAllowedSendingDays: [],
        productsSendingLimitPerDay: [],
        copySendingLimitPerDay: [],
        copyMinLimitPerDay: [],
        domainSending: [],
      },
      analyticSelectionRules: {
        clickableCopiesDaysInterval: 0,
        convertibleCopiesDaysInterval: 0,
        warmUpCopiesDaysInterval: 0,
        testCopiesDaysInterval: 0,
        domainRevenueDaysInterval: 0,
      },
      copyAssignmentStrategyRules: {
        strategies: [],
      },
    });
  const [productMondayStatuses, setProductMondayStatuses] =
    useState<GetProductStatusesResponse>({
      productStatuses: [],
      domainSendings: [],
    });
  const [domainMondayStatuses, setDomainMondayStatuses] =
    useState<GetDomainStatusesResponse>({
      uniqueDomainStatuses: [],
      uniqueEsps: [],
      uniqueParentCompanies: [],
    });
  const [broadcastsSheets, setBroadcastsSheets] = useState<
    BroadcastListItemResponse[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const fetchProductStatuses = async () => {
    try {
      const response = await getProductStatuses();
      if (!response) throw new Error("Failed to fetch product statuses");
      setProductMondayStatuses(response);
    } catch (error) {
      toastError("Failed to fetch product statuses");
      setProductMondayStatuses({
        productStatuses: [],
        domainSendings: [],
      });
    }
  };

  const fetchDomainStatuses = async () => {
    try {
      const response = await getDomainStatuses();
      if (!response) throw new Error("Failed to fetch domain statuses");
      setDomainMondayStatuses(response);
    } catch (error) {
      toastError("Failed to fetch domain statuses");
      setDomainMondayStatuses({
        uniqueDomainStatuses: [],
        uniqueEsps: [],
        uniqueParentCompanies: [],
      });
    }
  };

  const fetchBroadcastsSheets = async () => {
    try {
      const response = await getBroadcastsList();
      if (!response) throw new Error("Failed to fetch broadcasts sheets");
      setBroadcastsSheets(response.sheets);
    } catch (error) {
      toastError("Failed to fetch broadcasts sheets");
      setBroadcastsSheets([]);
    }
  };

  const createBroadcast = async () => {
    setIsLoading(true);
    try {
      if (!broadcastRules.name || !broadcastRules.broadcastSpreadsheetId) {
        toastError("Please enter name and select spreadsheet.");
        return;
      }
      const response = await createBroadcastRules(broadcastRules);
      if (!response) throw new Error("Failed to create broadcast rule");

      toastSuccess("Broadcast rule created successfully");
      setIsConfirmOpen(false);
      onClose();
    } catch (error) {
      toastError("Failed to create broadcast rule");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);

      Promise.allSettled([
        fetchProductStatuses(),
        fetchDomainStatuses(),
        fetchBroadcastsSheets(),
      ]).finally(() => {
        setIsLoading(false);
      });
    }
  }, [isOpen]);

  const handleChange = (key: keyof CreateBroadcastRulesRequest, value: any) => {
    setBroadcastRules((prevBroadcastRules) => ({
      ...prevBroadcastRules,
      [key]: value,
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case "domain-rules":
        return (
          <DomainRulesTab
            domainRules={broadcastRules.domainRules}
            onChange={(updated) => handleChange("domainRules", updated)}
            domainMondayStatuses={domainMondayStatuses}
          />
        );
      case "usage-rules":
        return (
          <UsageRulesTab
            usageRules={broadcastRules.usageRules}
            onChange={(updated) => handleChange("usageRules", updated)}
          />
        );
      case "testing-rules":
        return (
          <TestingRulesTab
            testingRules={broadcastRules.testingRules}
            onChange={(updated) => handleChange("testingRules", updated)}
          />
        );
      case "partner-rules":
        return (
          <PartnerRulesTab
            partnerRules={broadcastRules.partnerRules}
            onChange={(updated) => handleChange("partnerRules", updated)}
          />
        );
      case "product-rules":
        return (
          <ProductRulesTab
            productRules={broadcastRules.productRules}
            onChange={(updated) => handleChange("productRules", updated)}
            domainMondayStatuses={domainMondayStatuses}
            productMondayStatuses={productMondayStatuses}
          />
        );
      case "analytic-selection-rules":
        return (
          <AnalyticSelectionRulesTab
            analyticSelectionRules={broadcastRules.analyticSelectionRules}
            onChange={(updated) =>
              handleChange("analyticSelectionRules", updated)
            }
          />
        );
      case "copy-assignment-strategy-rules":
        return (
          <CopyAssignmentStrategyRulesTab
            copyAssignmentStrategyRules={
              broadcastRules.copyAssignmentStrategyRules
            }
            onChange={(updated) =>
              handleChange("copyAssignmentStrategyRules", updated)
            }
          />
        );
      case "general":
        return (
          <GeneralTab
            name={broadcastRules.name}
            broadcastsList={broadcastsSheets}
            broadcastSpreadsheetId={broadcastRules.broadcastSpreadsheetId}
            onChange={(updated) =>
              setBroadcastRules((prev) => ({
                ...prev,
                ...updated,
              }))
            }
            onConfirmRequest={() => setIsConfirmOpen(true)}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <AdminModal isOpen={isOpen} onClose={onClose}>
        <Loader />
      </AdminModal>
    );
  }

  return (
    <AdminModal isOpen={isOpen} onClose={onClose}>
      <CreateContainer>
        <BlockHeader>
          <h2>Create Broadcast</h2>
        </BlockHeader>
        <TabsContainer>
          <TabButton
            active={activeTab === "domain-rules"}
            onClick={() => setActiveTab("domain-rules")}
          >
            Domain Rules
          </TabButton>
          <TabButton
            active={activeTab === "usage-rules"}
            onClick={() => setActiveTab("usage-rules")}
          >
            Usage Rules
          </TabButton>
          <TabButton
            active={activeTab === "testing-rules"}
            onClick={() => setActiveTab("testing-rules")}
          >
            Testing Rules
          </TabButton>
          <TabButton
            active={activeTab === "partner-rules"}
            onClick={() => setActiveTab("partner-rules")}
          >
            Partner Rules
          </TabButton>
          <TabButton
            active={activeTab === "product-rules"}
            onClick={() => setActiveTab("product-rules")}
          >
            Product Rules
          </TabButton>
          <TabButton
            active={activeTab === "analytic-selection-rules"}
            onClick={() => setActiveTab("analytic-selection-rules")}
          >
            Analytic Selection Rules
          </TabButton>
          <TabButton
            active={activeTab === "copy-assignment-strategy-rules"}
            onClick={() => setActiveTab("copy-assignment-strategy-rules")}
          >
            Copy Assignment Strategy Rules
          </TabButton>
          <TabButton
            active={activeTab === "general"}
            onClick={() => setActiveTab("general")}
          >
            General
          </TabButton>
        </TabsContainer>
        <Container>{renderContent()}</Container>
      </CreateContainer>
      <ConfirmCreateModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsConfirmOpen(false);
          createBroadcast();
        }}
      />
    </AdminModal>
  );
};

export default CreateBroadcastModal;
