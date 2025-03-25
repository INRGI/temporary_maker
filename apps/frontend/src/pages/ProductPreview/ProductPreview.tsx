import axios from "axios";
import {
  CardHeader,
  Container,
  CopiesList,
  CopyCard,
  InputContainer,
  InputGroup,
  SubmitButton,
} from "./ProductPreview.styled";
import { useState } from "react";
import { toastError, toastSuccess } from "../../helpers/toastify";
import Loader from "../../components/Loader";
import PreviewModal from "../../components/PreviewModal";
import { PreviewButton } from "../../components/CopyMaker/CopyMaker.styled";
import FloatingLabelInput from "../../components/FloatingLabelInput/FloatingLabelInput";

const ProductPreview: React.FC = () => {
  const [product, setProduct] = useState("");
  const [loading, setLoading] = useState(false);
  const [copies, setCopies] = useState([]);
  const [previewModal, setPreviewModal] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");

  const getAllCopies = async () => {
    if (!product) return toastError("Please enter a product name.");
    try {
      setLoading(true);
      const result = await axios.get(`/api/copy/all-copies/${product}`);
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
            placeholder="Product Name (ex: BTUA)"
          />
        </InputContainer>
        <SubmitButton onClick={() => getAllCopies()}>GET</SubmitButton>
      </InputGroup>
      {loading ? (
        <Loader />
      ) : (
        <CopiesList>
          {copies.map((copy: { copyName: string; html: string }) => (
            <CopyCard key={copy.copyName}>
              <CardHeader>
                <h2>{copy.copyName}</h2>

                <PreviewButton
                  onClick={() => {
                    setPreviewHtml(copy.html);
                    setPreviewModal(true);
                  }}
                >
                  Preview
                </PreviewButton>
              </CardHeader>
            </CopyCard>
          ))}
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

export default ProductPreview;
