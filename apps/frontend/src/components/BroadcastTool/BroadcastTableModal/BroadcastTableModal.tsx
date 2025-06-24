import React, { useState } from "react";
import AdminModal from "../../Common/AdminModal";
import {
  ApproveButton,
  BackButton,
  ControlsRight,
  CopyBlock,
  CopySpan,
  DomainTd,
  ModalBody,
  TabButton,
  TabControls,
  TabHeader,
  Table,
  TableWrapper,
  Td,
  Th,
} from "./BroadcastTableModal.styled";
import { ApproveBroadcastSheetRequest, GetAllDomainsResponse } from "../../../api/broadcast";
import {
  IoIosArrowRoundBack,
  IoMdCheckmarkCircleOutline,
} from "react-icons/io";
import { toastError, toastSuccess } from "../../../helpers/toastify";
import { approveBroadcast } from "../../../api/broadcast.api";

interface BroadcastTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  broadcast: GetAllDomainsResponse;
  spreadSheetId: string;
}

const BroadcastTableModal: React.FC<BroadcastTableModalProps> = ({
  isOpen,
  onClose,
  broadcast,
  spreadSheetId
}) => {
  const [broadcastData, setBroadcastData] = useState(broadcast);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [editCell, setEditCell] = useState<{
    domain: string;
    date: string;
  } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const activeSheet = broadcastData.sheets[activeTabIndex];
  const domains = activeSheet.domains;

  const allDates = Array.from(
    new Set(domains.flatMap((d) => d.broadcastCopies.map((c) => c.date)))
  ).sort((a, b) => {
    const parseDate = (d: string) => {
      const [m, day] = d.trim().split(/[\/.]/).map(Number);
      return m * 100 + day;
    };
    return parseDate(a) - parseDate(b);
  });

  const handleEdit = (domain: string, date: string) => {
    const newData = { ...broadcastData };
    const domainItem = newData.sheets[activeTabIndex].domains.find(
      (d) => d.domain === domain
    );
    let copyItem = domainItem?.broadcastCopies.find((c) => c.date === date);

    if (!copyItem && domainItem) {
      copyItem = { date, copies: [], isModdified: false };
      domainItem.broadcastCopies.push(copyItem);
    }

    setBroadcastData(newData);
    setEditCell({ domain, date });
    setEditValue(copyItem?.copies.map((c) => c.name).join(", ") || "");
  };

  const handleSave = (domain: string, date: string) => {
    const newData = { ...broadcastData };
    const domainItem = newData.sheets[activeTabIndex].domains.find(
      (d) => d.domain === domain
    );
    const copyItem = domainItem?.broadcastCopies.find((c) => c.date === date);
    if (copyItem) {
      copyItem.copies = editValue
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((name) => ({ name, isPriority: false }));
      copyItem.isModdified = true;
    }
    setBroadcastData(newData);
    setEditCell(null);
  };

  const formatDateToMMDD = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}/${day}`;
  };

  const handleApproveBroadcast = async () => {
      try {
        setIsLoading(true);
        const data: ApproveBroadcastSheetRequest[] = broadcastData.sheets.map((sheet) => ({
          spreadsheetId: spreadSheetId,
          sheetName: sheet.sheetName,
          broadcast: sheet.domains.map((domain) => ({
            domain: domain.domain,
            esp: domain.esp,
            sendingCopiesPerDay: domain.sendingCopiesPerDay,
            broadcastCopies: domain.broadcastCopies,
          }))
        }))
        const result = await approveBroadcast({
          broadcast: data
        });
        if (!result) {
          return toastError("Failed to approve broadcast");
        }
        
        toastSuccess("Broadcast approved successfully");
        setIsLoading(false);
  
        onClose();
      } catch (error) {
        toastError("Failed to approve broadcast");
        setIsLoading(false);
      }
    };

  return (
    <AdminModal isOpen={isOpen} onClose={onClose}>
      <ModalBody>
        <TabControls>
          <TabHeader>
            {broadcastData.sheets.map((sheet, index) => (
              <TabButton
                key={sheet.sheetName}
                active={index === activeTabIndex}
                onClick={() => setActiveTabIndex(index)}
              >
                {sheet.sheetName}
              </TabButton>
            ))}
          </TabHeader>
          <ControlsRight>
            <ApproveButton>
              <IoMdCheckmarkCircleOutline onClick={handleApproveBroadcast} /> Approve
            </ApproveButton>
            <BackButton>
              <IoIosArrowRoundBack onClick={onClose} /> Back
            </BackButton>
          </ControlsRight>
        </TabControls>

        <TableWrapper key={activeSheet.sheetName}>
          <Table>
            <thead>
              <tr>
                <Th rotated>Domain</Th>
                {domains.map((domain) => (
                  <Th key={domain.domain} rotated>
                    {domain.domain}
                  </Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allDates.map((date) => (
                <tr key={date}>
                  <DomainTd>{formatDateToMMDD(new Date(date))}</DomainTd>
                  {domains.map((domain) => {
                    const entry = domain.broadcastCopies.find(
                      (c) => c.date === date
                    );
                    const isEditing =
                      editCell?.domain === domain.domain &&
                      editCell?.date === date;

                    return (
                      <Td
                        key={domain.domain + date}
                        isHighlighted={entry?.isModdified}
                        onDoubleClick={() => handleEdit(domain.domain, date)}
                      >
                        {isEditing ? (
                          <input
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => handleSave(domain.domain, date)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter")
                                handleSave(domain.domain, date);
                              if (e.key === "Escape") setEditCell(null);
                            }}
                            style={{
                              width: "100%",
                              backgroundColor: "#2b2b2b",
                              color: "white",
                              border: "1px solid #666",
                              borderRadius: 4,
                              padding: "4px 8px",
                            }}
                          />
                        ) : (
                          <CopyBlock>
                            {entry?.copies.map((copy, idx) => (
                              <CopySpan key={idx} bold={copy.isPriority}>
                                {copy.name}
                              </CopySpan>
                            ))}
                          </CopyBlock>
                        )}
                      </Td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      </ModalBody>
    </AdminModal>
  );
};

export default BroadcastTableModal;
