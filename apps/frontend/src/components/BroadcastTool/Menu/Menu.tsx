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
  createBroadcastRules,
  deleteBroadcastRules,
  getPaginatedBroadcastRules,
} from "../../../api/broadcast-rules.api";
import { CreateBroadcastRulesRequest } from "../../../api/broadcast-rules";
import CreateBroadcastModal from "../CreateBroadcastModal";
import Loader from "../../Common/Loader";

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

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("preset_sidebar_collapsed", String(newState));
  };

  const fetchBroadcastRules = async () => {
    try {
      setIsLoading(true);
      const response = await getPaginatedBroadcastRules();
      setBroadcastEntities(response.items);
      setIsLoading(false);
    } catch (error) {
      toastError("Failed to fetch broadcast rules");
      setBroadcastEntities([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBroadcastRules();
  }, []);

  useEffect(() => {
    if (broadcastEntities && broadcastEntities.length && activeEntity) {
      setActiveEntity(
        broadcastEntities.find((entity) => entity.name === activeEntity.name) ||
          null
      );
    }
  }, [broadcastEntities]);

  const handleDeleteEntity = async (entity: BroadcastRulesEntity) => {
    try {
        setIsLoading(true);
      await deleteBroadcastRules(entity.id);
      toastSuccess("Broadcast rule deleted successfully");
      fetchBroadcastRules();
      setIsLoading(false);
    } catch (error) {
      toastError("Failed to delete broadcast rule");
      setIsLoading(false);
    }
  };

  const handleCreateBroadcastRule = async (
    body: CreateBroadcastRulesRequest
  ) => {
    try {
        setIsLoading(true);
      const response = await createBroadcastRules(body);
      if (response) {
        toastSuccess("Broadcast rule created successfully");
        fetchBroadcastRules();
        setIsLoading(false);
      }
    } catch (error) {
      toastError("Failed to create broadcast rule");
      setIsLoading(false);
    }
  };

  const filteredPresets = broadcastEntities && broadcastEntities.length > 0 ? broadcastEntities.filter((entity) =>
    entity.name.toLowerCase().includes(searchText.toLowerCase())
  ) : [];

  if(isLoading) {
    return <Loader />
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
                id={entity.id}
                key={entity.name}
                isActive={entity.name === activeEntity?.name}
                onClick={(event) => setActiveEntity(entity)}
              >
                <h2>{entity.name}</h2>
                {!isCollapsed && (
                  <div className="preset-actions">
                    <DeleteButton onClick={() => handleDeleteEntity(entity)}>
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
            onClose={() => setCreateModalOpen(false)}
            onCreate={() => handleCreateBroadcastRule}
          />
        )}
      </Container>

      {activeEntity && <RulesContainer broadcastEntity={activeEntity} />}
    </RootContainer>
  );
};

export default Menu;
