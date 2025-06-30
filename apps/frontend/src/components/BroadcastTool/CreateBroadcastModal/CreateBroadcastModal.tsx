import { useState } from "react";
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
import GeneralTab from "../GeneralTab";
import { createBroadcastRules } from "../../../api/broadcast-rules.api";
import ConfirmationModal from "../ConfirmationModal";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  domainMondayStatuses: GetDomainStatusesResponse;
  productMondayStatuses: GetProductStatusesResponse;
  broadcastsSheets: BroadcastListItemResponse[];
}

const CreateBroadcastModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
  domainMondayStatuses,
  productMondayStatuses,
  broadcastsSheets,
}) => {
  const [activeTab, setActiveTab] = useState("general");
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
        copyTabLimit: [],
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
        domainStrategies: [],
      },
    });
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const createBroadcast = async () => {
    setIsLoading(true);
    try {
      if (!broadcastRules.name || !broadcastRules.broadcastSpreadsheetId) {
        toastError("Please enter name and select spreadsheet.");
        setIsLoading(false);
        return;
      }
      const response = await createBroadcastRules(broadcastRules);
      if (!response) throw new Error("Failed to create broadcast rule");

      toastSuccess("Broadcast rule created successfully");
      setIsConfirmOpen(false);
      onClose();
    } catch (error) {
      toastError("Failed to create broadcast rule");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

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
            spreadsheetId={broadcastRules.broadcastSpreadsheetId}
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
            spreadsheetId={broadcastRules.broadcastSpreadsheetId}
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
            active={activeTab === "general"}
            onClick={() => setActiveTab("general")}
          >
            General
          </TabButton>
          <TabButton
            active={activeTab === "domain-rules"}
            onClick={() => setActiveTab("domain-rules")}
          >
            Domain Rules
          </TabButton>
          {broadcastRules.broadcastSpreadsheetId && (
            <TabButton
              active={activeTab === "usage-rules"}
              onClick={() => setActiveTab("usage-rules")}
            >
              Usage Rules
            </TabButton>
          )}
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
          {broadcastRules.broadcastSpreadsheetId && (
            <TabButton
              active={activeTab === "copy-assignment-strategy-rules"}
              onClick={() => setActiveTab("copy-assignment-strategy-rules")}
            >
              Copy Assignment Strategy Rules
            </TabButton>
          )}
        </TabsContainer>
        <Container>{renderContent()}</Container>
      </CreateContainer>
      <ConfirmationModal
        title="Confirm Creation"
        message="Are you sure you filled out all the fields?"
        confirmButtonText="Create"
        cancelButtonText="Cancel"
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          createBroadcast();
        }}
      />
    </AdminModal>
  );
};

export default CreateBroadcastModal;
