import styled from "@emotion/styled";

export const Wrapper = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  gap: 10px;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  padding-bottom: 20px;
`;

export const CollapsibleTab = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const TabHeader = styled.button<{ active: boolean }>`
  width: calc(100% - 32px);
  background-color: ${({ active }) => (active ? "#444" : "#3a3a3a")};
  color: white;
  padding: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  text-align: left;

  &:hover {
    background-color: #4f4f4f;
  }
`;

export const StrategyRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  background-color: #1f1f1f;
  padding: 10px;
  border-radius: 6px;
  width: calc(100% - 52px);
`;

export const Column = styled.div`
  flex: 1;
`;

export const SmallSelect = styled.select`
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #4f4f4f;
  background-color: #3a3a3a;
  color: white;
  font-size: 14px;
  width: 100%;
`;

export const RemoveButton = styled.button`
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #c9302c;
  }
`;

export const AddTypeButton = styled.button`
  background-color: #6a5acd;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #5941a9;
  }
`;

export const ResetButton = styled.button`
  background-color: #555;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #777;
  }
`;