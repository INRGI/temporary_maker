import styled from "@emotion/styled";
import React from "react";

const Wrapper = styled.div`
  width: 100%;
  padding: 16px;
  background-color: #2b2b2b;
  border: 1px solid #4f4f4f;
  border-radius: 8px;
`;

const Title = styled.p`
  color: white;
  margin: 0;
  padding: 0;
  margin-bottom: 16px;
  text-align: center;
`;

const Row = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  align-items: flex-start;
`;

const Column = styled.div`
  flex: 1;
`;

const Label = styled.label`
  color: white;
  font-size: 14px;
  display: block;
  margin-bottom: 6px;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #4f4f4f;
  background-color: #3a3a3a;
  color: white;
  font-size: 14px;
`;

const AddButton = styled.button`
  background-color: #6a5acd;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #5941a9;
  }
`;

const RemoveButton = styled.button`
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 14px;
  align-self: center;

  &:hover {
    background-color: #c9302c;
  }
`;

const MiniRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 6px;
  align-items: center;
`;

const SmallSelect = styled.select`
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #4f4f4f;
  background-color: #3a3a3a;
  color: white;
  font-size: 14px;
  flex: 1;
`;

interface StrategyItem {
  copiesPerDay: number;
  copiesTypes: ("click" | "conversion" | "test" | "warmup")[];
}

interface CopyAssignmentStrategiesEditorProps {
  items: StrategyItem[];
  onChange: (items: StrategyItem[]) => void;
  title: string;
}

const CopyAssignmentStrategiesEditor: React.FC<CopyAssignmentStrategiesEditorProps> = ({
  items,
  onChange,
  title,
}) => {
  const allowedTypes = ["click", "conversion", "test", "warmup"];

  const handleChange = <K extends keyof StrategyItem>(
    index: number,
    field: K,
    value: StrategyItem[K]
  ) => {
    const updated = [...items];
    updated[index][field] = value;

    if (field === "copiesPerDay") {
      const newLength = typeof value === "number" ? value : 0;
      if (newLength > updated[index].copiesTypes.length) {
        const missing = newLength - updated[index].copiesTypes.length;
        updated[index].copiesTypes = [
          ...updated[index].copiesTypes,
          ...Array(missing).fill("click"),
        ];
      } else {
        updated[index].copiesTypes = updated[index].copiesTypes.slice(0, newLength);
      }
    }

    onChange(updated);
  };

  const handleAdd = () => {
    onChange([...items, { copiesPerDay: 0, copiesTypes: [] }]);
  };

  const handleRemove = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleTypeChange = (index: number, typeIndex: number, newType: string) => {
    const updated = [...items];
    updated[index].copiesTypes[typeIndex] = newType as StrategyItem["copiesTypes"][number];
    onChange(updated);
  };

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      handleChange(index, "copiesPerDay", Number(value));
    }
  };

  return (
    <Wrapper>
      <Title>{title}</Title>
      {items.map((item, index) => (
        <Row key={index}>
          <Column>
            <Label>Copies Per Day</Label>
            <Input
              inputMode="numeric"
              pattern="[0-9]*"
              value={item.copiesPerDay.toString()}
              onChange={(e) => handleInputChange(index, e)}
            />
          </Column>
          <Column>
            <Label>Copies Types (ordered)</Label>
            {item.copiesTypes.map((type, typeIndex) => (
              <MiniRow key={typeIndex}>
                <SmallSelect
                  value={type}
                  onChange={(e) => handleTypeChange(index, typeIndex, e.target.value)}
                >
                  {allowedTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </SmallSelect>
              </MiniRow>
            ))}
          </Column>
          <RemoveButton onClick={() => handleRemove(index)}>✕</RemoveButton>
        </Row>
      ))}
      <AddButton onClick={handleAdd}>+ Add Strategy</AddButton>
    </Wrapper>
  );
};

export default CopyAssignmentStrategiesEditor;
