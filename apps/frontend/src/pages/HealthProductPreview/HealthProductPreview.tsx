/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import {
  CardHeader,
  Container,
  CopiesList,
  CopyCard,
  InputContainer,
  InputGroup,
  SubmitButton,
} from "../ProductPreview/ProductPreview.styled";
import { useState } from "react";
import { toastError, toastSuccess } from "../../helpers/toastify";


import {
  PreviewButton,
  Subject,
  TextTitle,
} from "../../components/Health/CopyMaker/CopyMaker.styled";
import FloatingLabelInput from "../../components/Common/FloatingLabelInput/FloatingLabelInput";
import Loader from "../../components/Common/Loader";
import PreviewModal from "../../components/Common/PreviewModal";

const HealthProductPreview: React.FC = () => {
  const [product, setProduct] = useState("");
  const [maxLift, setMaxLift] = useState(999);
  const [minLift, setMinLift] = useState(0);
  const [loading, setLoading] = useState(false);
  const [copies, setCopies] = useState([]);
  const [previewModal, setPreviewModal] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");

  const getAllCopies = async () => {
    if (!product) return toastError("Please enter a product name.");
    try {
      setLoading(true);
      const result = await axios.get(
        `/api/health/copy/all-copies/${product}?minLift=${minLift}&maxLift=${maxLift}`
      );
      setCopies(result.data);
      toastSuccess("Copies fetched successfully.");
    } catch (error) {
      toastError("Error fetching copies.");
    } finally {
      setLoading(false);
    }
  };

  const handleClosePreviewModal = () => {
    setPreviewHtml("");
    setPreviewModal(false);
  };

  return (
    <Container>
      <InputGroup>
        <InputContainer>
          <FloatingLabelInput
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Product Name (ex: BANZ)"
          />
        </InputContainer>
        <InputContainer>
          <FloatingLabelInput
            value={minLift}
            onChange={(e) => setMinLift(Number(e.target.value))}
            placeholder="Min Lift(ex: 0)"
          />
        </InputContainer>
        <InputContainer>
          <FloatingLabelInput
            value={maxLift}
            onChange={(e) => setMaxLift(Number(e.target.value))}
            placeholder="Max Lift(ex: 999)"
          />
        </InputContainer>
        <SubmitButton onClick={() => getAllCopies()}>GET</SubmitButton>
      </InputGroup>
      {loading ? (
        <Loader />
      ) : (
        <CopiesList>
          {copies.map(
            (copy: { copyName: string; html: string; subjects?: string[] }) => (
              <CopyCard key={copy.copyName}>
                <CardHeader>
                  <h2>{copy.copyName}</h2>

                  {copy.html.includes("Error reading file") || !copy.html ? (
                    <TextTitle>HTML not found</TextTitle>
                  ) : (
                    <PreviewButton
                      onClick={() => {
                        setPreviewHtml(copy.html);
                        setPreviewModal(true);
                      }}
                    >
                      Preview
                    </PreviewButton>
                  )}
                </CardHeader>
                {copy.subjects && !copy.html.includes("Error reading file") && copy.html && (
                  <>
                    <TextTitle>Subjects:</TextTitle>
                    {copy.subjects.map((subject, index) => (
                      <Subject key={index}>{subject}</Subject>
                    ))}
                  </>
                )}
              </CopyCard>
            )
          )}
        </CopiesList>
      )}

      {previewModal && (
        <PreviewModal
          html={previewHtml}
          onClose={handleClosePreviewModal}
          isOpen={previewModal}
        />
      )}
    </Container>
  );
};

export default HealthProductPreview;
