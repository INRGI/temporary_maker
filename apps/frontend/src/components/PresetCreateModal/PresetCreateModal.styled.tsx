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

export const CreatePresetContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 500px;
  max-width: 500px;
  width: 100%;
  gap: 20px;
  background-color: #181818;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
  justify-content: center;
`;

export const Container = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  /* align-items: center; */
`;


export const BlockHeader = styled.div`
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-content: center;

  h2 {
    font-size: 30px;
    line-height: 1.2;
    color: #fff;
    margin: 0;
    font-weight: 500;
    font-family: 'Arial Black', sans-serif;
    text-transform: uppercase;
    border-bottom: 2px solid #fff;
  }

  p {
    text-transform: uppercase;
    font-size: 20px;
    color: #fff;
    margin: 0;
    padding: 0;
    padding-left: 2px;
  }

  @media (max-width: 1023px) {
    h2 {
      font-size: 22px;
    }
    p {
      font-size: 15px;
    }
  }

  @media (max-width: 430px) {
    h2 {
      font-size: 16px;
    }
    p {
      font-size: 14px;
    }
  }
`;

export const CenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 40px
`;