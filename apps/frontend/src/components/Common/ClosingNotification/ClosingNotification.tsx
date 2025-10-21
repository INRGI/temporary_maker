import React, { useEffect, useMemo, useState } from "react";
import AdminModal from "../../Common/AdminModal";
import styled from "@emotion/styled";

const ModalBody = styled.div`
  background-color: #161313;
  padding: 22px;
  border-radius: 12px;
  width: 520px;
  max-width: 94vw;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const ConfirmButton = styled.a`
  padding: 10px 16px;
  background-color: #c62828;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, transform 0.1s ease;
  &:hover {
    background-color: #b71c1c;
  }
  &:active {
    transform: scale(0.98);
  }
`;

const GhostButton = styled.button`
  padding: 10px 16px;
  background-color: #6d1b1b;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #7f1f1f;
  }
`;

const Inline = styled.span`
  a {
    color: #ef5350;
    text-decoration: underline;
  }
`;

export interface ClosingNotificationProps {
  docUrl: string;
  newUrl: string;
  title?: string;
}

const DEADLINE_ISO = "2025-10-28T23:59:59";

function formatRemaining(ms: number) {
  if (ms <= 0) return "00d 00h 00m 00s";
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(days)}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
}

let shownThisSpaSession = false;

const ClosingNotification: React.FC<ClosingNotificationProps> = ({
  docUrl,
  newUrl,
  title,
}) => {
  const deadline = useMemo(() => new Date(DEADLINE_ISO), []);
  const [now, setNow] = useState<Date>(() => new Date());

  const [shouldShowThisMount, setShouldShowThisMount] = useState<boolean>(
    () => !shownThisSpaSession
  );

  useEffect(() => {
    shownThisSpaSession = true;
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const beforeDeadline = now < deadline;
  const isOpen = beforeDeadline && shouldShowThisMount;

  const remaining = useMemo(
    () => formatRemaining(deadline.getTime() - now.getTime()),
    [deadline, now]
  );

  if (!isOpen) return null;

  const handleClose = () => setShouldShowThisMount(false);

  return (
    <AdminModal isOpen={isOpen} onClose={handleClose}>
      <ModalBody>
        <h3 style={{ margin: 0, fontSize: 20, color: "#FF5252" }}>
          {title ?? "IMPORTANT: This version will be closed soon"}
        </h3>
        <p style={{ margin: 0, opacity: 0.95, color: "#FF8A80" }}>
          Time left: <strong>{remaining}</strong>
        </p>
        <p style={{ margin: 0 }}>
          <Inline>
            Please switch to the{" "}
            <a href={newUrl} target="_blank" rel="noreferrer">
              new version
            </a>
            . Documentation:{" "}
            <a href={docUrl} target="_blank" rel="noreferrer">
              read the docs
            </a>
            .
          </Inline>
        </p>
        <ModalActions>
          <GhostButton onClick={handleClose}>Close</GhostButton>
          <ConfirmButton href={newUrl} target="_blank" rel="noreferrer">
            Go to new version
          </ConfirmButton>
        </ModalActions>
      </ModalBody>
    </AdminModal>
  );
};

export default ClosingNotification;
