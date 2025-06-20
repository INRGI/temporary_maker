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
import { toastError } from "../../../helpers/toastify";
import { getDomainStatuses, getProductStatuses } from "../../../api/monday.api";
import {
  GetDomainStatusesResponse,
  GetProductStatusesResponse,
} from "../../..//api/monday";
import UsageRulesTab from "../UsageRulesTab";
import TestingRulesTab from "../TestingRulesTab";
import PartnerRulesTab from "../PartnerRulesTab";
import ProductRulesTab from "../ProductRulesTab";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (body: CreateBroadcastRulesRequest) => void;
}

const CreateBroadcastModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
  onCreate,
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
  const [isLoading, setIsLoading] = useState(false);

  const fetchProductStatuses = async () => {
    try {
      setIsLoading(true);
      const response = await getProductStatuses();
      if (!response) throw new Error("Failed to fetch product statuses");
      setProductMondayStatuses(response);
      setIsLoading(false);
    } catch (error) {
      toastError("Failed to fetch product statuses");
      setProductMondayStatuses({
        productStatuses: [],
        domainSendings: [],
      });
      setIsLoading(false);
    }
  };

  const fetchDomainStatuses = async () => {
    try {
      setIsLoading(true);
      const response = await getDomainStatuses();
      if (!response) throw new Error("Failed to fetch domain statuses");
      setDomainMondayStatuses(response);
      setIsLoading(false);
    } catch (error) {
      toastError("Failed to fetch domain statuses");
      setDomainMondayStatuses({
        uniqueDomainStatuses: [],
        uniqueEsps: [],
        uniqueParentCompanies: [],
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProductStatuses();
      fetchDomainStatuses();
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
      //   case "analytic-selection-rules":
      //     return <AnalyticSelectionRules />;
      //   case "copy-assignment-strategy-rules":
      //     return <CopyAssignmentStrategyRules />;
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
        </TabsContainer>
        <Container>{renderContent()}</Container>
      </CreateContainer>
    </AdminModal>
  );
};

export default CreateBroadcastModal;
