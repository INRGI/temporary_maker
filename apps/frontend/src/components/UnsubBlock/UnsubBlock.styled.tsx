import styled from '@emotion/styled';

export const SaveButton = styled.button`
  padding: 13px 20px;
  background-color: #6a5acd;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: inline-block;
  width: 100%;

  &:hover {
    background-color: #5941a9;
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(106, 90, 205, 0.6);
  }
`;

export const SpanWhite = styled.span`
  color: white;
`;

export const Container = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-content: center;
`;

export const InputGroup = styled.div`
  display: flex;
  max-width: 400px;
  align-items: center;
  gap: 10px;
  background-color: #3c3c3c;
  padding: 10px;
  border-radius: 8px;
  border: 2px solid transparent;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
`;

export const InputContainer = styled.div`
  width: 100%;
`;
export const StyledCheckbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  appearance: none;
  border: 2px solid #ccc; 
  border-radius: 4px; 
  background-color: white; 
  position: relative;
  transition: transform 0.2s, background-color 0.3s, border-color 0.3s;

  
  &::before {
    content: '';
    position: absolute;
    left: 3px;
    top: 1px;
    width: 6px; 
    height: 6px; 
    border-left: 2px solid white;
    border-bottom: 2px solid white;
    transform: rotate(-45deg);
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:checked::before {
    opacity: 1; 
  }

  &:checked {
    background-color: #6a5acd; 
    border-color: #6a5acd;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(106, 90, 205, 0.6);
  }

  &:hover {
    transform: scale(1.1); 
  }
`;


export const StyledInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #6a5acd;
    outline: none;
  }
`;

export const OverflowContainer = styled.div`
  overflow-y: scroll;
  height: calc(100vh - 420px);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;