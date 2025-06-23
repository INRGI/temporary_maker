import { useEffect, useState } from "react";
import RulesContainer from "../RulesContainer";
import {
  BroadcastRuleCard,
  BroadcastRulesContainer,
  Button,
  Container,
  DeleteButton,
  HeaderContainer,
  RootContainer,
  ServicesBlockHeader,
} from "./Menu.styled";
import { BroadcastRulesEntity } from "../../../types/broadcast-tool/broadcast-rules-entity.interface";
import { toastError, toastSuccess } from "../../../helpers/toastify";
import SearchInput from "../../Common/SearchInput/SearchInput";
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";
import {
  deleteBroadcastRules,
  getPaginatedBroadcastRules,
} from "../../../api/broadcast-rules.api";
import CreateBroadcastModal from "../CreateBroadcastModal";
import Loader from "../../Common/Loader";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import {
  GetDomainStatusesResponse,
  GetProductStatusesResponse,
} from "../../../api/monday";
import { BroadcastListItemResponse } from "../../../api/broadcast/response/broadcast-list-item.response.dto";
import { getDomainStatuses, getProductStatuses } from "../../../api/monday.api";
import { getBroadcastsList } from "../../../api/broadcast.api";

const Menu: React.FC = () => {
  const [broadcastEntities, setBroadcastEntities] = useState<
    BroadcastRulesEntity[]
  >([]);
  const [searchText, setSearchText] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [activeEntity, setActiveEntity] = useState<BroadcastRulesEntity | null>(
    null
  );
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    return localStorage.getItem("preset_sidebar_collapsed") === "true";
  });
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [entityToDeleteId, setEntityToDeleteId] = useState<string | null>(null);

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

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("preset_sidebar_collapsed", String(newState));
  };

  useEffect(() => {
    setIsLoading(true);

    Promise.allSettled([
      fetchProductStatuses(),
      fetchDomainStatuses(),
      fetchBroadcastsSheets(),
      fetchBroadcastRules(),
    ]).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const fetchBroadcastRules = async () => {
    try {
      const response = await getPaginatedBroadcastRules();
      setBroadcastEntities(response.items);
    } catch (error) {
      toastError("Failed to fetch broadcast rules");
      setBroadcastEntities([]);
    }
  };

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

  useEffect(() => {
    if (!broadcastEntities.length) return;
  
    const stillExists = broadcastEntities.find(e => e._id === activeEntity?._id);
    if (!stillExists) {
      setActiveEntity(broadcastEntities[0]);
    } else {
      setActiveEntity(stillExists);
    }
  }, [broadcastEntities]);
  

  const handleDeleteEntity = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteBroadcastRules(id);
      toastSuccess("Broadcast rule deleted successfully");
      fetchBroadcastRules();
      setIsLoading(false);
    } catch (error) {
      toastError("Failed to delete broadcast rule");
      setIsLoading(false);
    }
  };

  const onEntityUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await getPaginatedBroadcastRules();
      setBroadcastEntities(response.items);
  
      const updated = response.items.find((e) => e._id === activeEntity?._id);
      if (updated) {
        setActiveEntity({ ...updated });
      }
    } catch (error) {
      toastError("Failed to fetch broadcast rules");
    } finally {
      setIsLoading(false);
    }
  };
  

  const filteredPresets =
    broadcastEntities && broadcastEntities.length > 0
      ? broadcastEntities.filter((entity) =>
          entity.name.toLowerCase().includes(searchText.toLowerCase())
        )
      : [];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <RootContainer>
      <Container className={isCollapsed ? "collapsed" : ""}>
        <HeaderContainer>
          <ServicesBlockHeader>
            <h2>Broadcasts</h2>
          </ServicesBlockHeader>
          <Button
            onClick={toggleSidebar}
            title="Toggle sidebar"
            style={{ marginLeft: "auto" }}
          >
            {isCollapsed ? (
              <BsArrowRightShort size={20} />
            ) : (
              <BsArrowLeftShort size={20} />
            )}
          </Button>

          <Button onClick={() => setCreateModalOpen(true)}>
            <FaPlus />
          </Button>
        </HeaderContainer>

        <SearchInput
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search broadcast by name"
        />

        <BroadcastRulesContainer>
          {filteredPresets.length ? (
            filteredPresets.map((entity) => (
              <BroadcastRuleCard
                id={entity._id}
                key={entity.name}
                isActive={entity.name === activeEntity?.name}
                onClick={(event) => setActiveEntity(entity)}
              >
                <h2>{entity.name}</h2>
                {!isCollapsed && (
                  <div className="preset-actions">
                    <DeleteButton
                      onClick={() => {
                        setEntityToDeleteId(entity._id);
                        setDeleteModalOpen(true);
                      }}
                    >
                      <MdDeleteForever />
                    </DeleteButton>
                  </div>
                )}
              </BroadcastRuleCard>
            ))
          ) : (
            <BroadcastRuleCard isActive={false}>
              Broadcasts Rules not found. Create one
            </BroadcastRuleCard>
          )}
        </BroadcastRulesContainer>

        {createModalOpen && (
          <CreateBroadcastModal
            isOpen={createModalOpen}
            onClose={() => {
              setCreateModalOpen(false);
              fetchBroadcastRules();
            }}
            domainMondayStatuses={domainMondayStatuses}
            productMondayStatuses={productMondayStatuses}
            broadcastsSheets={broadcastsSheets}
          />
        )}
        {deleteModalOpen && entityToDeleteId && (
          <ConfirmDeleteModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={() => {
              handleDeleteEntity(entityToDeleteId);
              setDeleteModalOpen(false);
            }}
          />
        )}
      </Container>

      {activeEntity && (
        <RulesContainer
        key={activeEntity._id}
          onEntityUpdate={onEntityUpdate}
          broadcastEntity={activeEntity}
          domainMondayStatuses={domainMondayStatuses}
          productMondayStatuses={productMondayStatuses}
          broadcastsSheets={broadcastsSheets}
        />
      )}
    </RootContainer>
  );
};

export default Menu;
