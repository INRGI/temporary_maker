import styled from "@emotion/styled";
import { SubmitButton } from "../../../pages/ProductPreview/ProductPreview.styled";
import { DublicateButton } from "../PresetContainer/PresetContainer.styled";

export const Button = styled(SubmitButton)`
  max-width: 160px;
`;

export const Copy = styled(DublicateButton)`
  min-width: 60px;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 500px;
  max-width: 500px;
  width: 100%;
  gap: 20px;
  justify-content: center;
`;

export const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;