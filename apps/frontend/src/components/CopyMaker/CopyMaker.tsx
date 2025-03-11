import { useState } from "react";
import { Preset, UnsubData } from "../../types";
import { ServicesBlockHeader } from "../PresetContainer/PresetContainer.styled";
import {
  AddButton,
  Button,
  CardHeader,
  Container,
  CopiesList,
  CopyButton,
  CopyCard,
  DownloadButton,
  HeaderContainer,
  ImageCard,
  ImagePreviewContainer,
  ImagesList,
  ReplaceButton,
  TextSpaceDivider,
  TextTitle,
} from "./CopyMaker.styled";
import { VscDebugStart } from "react-icons/vsc";
import { GrDownload } from "react-icons/gr";
import { BsCopy } from "react-icons/bs";
import axios from "axios";
import { toastError, toastSuccess } from "../../helpers/toastify";
import Loader from "../Loader";
import FloatingLabelInput from "../FloatingLabelInput/FloatingLabelInput";

interface Props {
  preset: Preset;
}

interface ResponseCopy {
  copyName: string;
  html: string;
  unsubData?: UnsubData;
  subjects?: string;
  imageLinks?: string[];
}

const CopyMaker: React.FC<Props> = ({ preset }) => {
  const [copies, setCopies] = useState<ResponseCopy[]>([]);
  const [loading, setLoading] = useState(false);
  const [addImageModal, setAddImageModal] = useState(false);
  const [imagesSource, setImagesSource] = useState([]);

  const makeCopies = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/copy/make-multiple-copies`,
        {
          preset: preset,
        }
      );
      setCopies(response.data);
      toastSuccess("Copies made successfully");
    } catch (error) {
      toastError("Something went wrong");
    }
  };

  const handleMakeCopies = async () => {
    setLoading(true);
    await makeCopies();
    setLoading(false);
  };

  const handleImageSourceReplace = async () => {};

  const handleAddImage = async () => {};

  return (
    <Container>
      <HeaderContainer>
        <ServicesBlockHeader>
          <h2>{preset.name}</h2>
        </ServicesBlockHeader>

        <Button onClick={() => handleMakeCopies()}>
          <VscDebugStart />
        </Button>
      </HeaderContainer>
      {loading ? (
        <Loader />
      ) : (
        <CopiesList>
          {copies.map((copy) => (
            <CopyCard key={copy.copyName}>
              <CardHeader>
                <h2>{copy.copyName}</h2>
                <div>
                  {copy.html.includes("Error") ? (
                    <TextTitle>Html not found</TextTitle>
                  ) : (
                    <TextSpaceDivider>
                      <TextTitle>Copy your html here</TextTitle>
                      <CopyButton
                        onClick={() => {
                          navigator.clipboard.writeText(copy.html);
                          toastSuccess("Copied to clipboard");
                        }}
                        type="button"
                      >
                        <BsCopy />
                      </CopyButton>
                    </TextSpaceDivider>
                  )}
                </div>
              </CardHeader>
              {!copy.html.includes("Error") && (
                <>
                  {copy.unsubData && (
                    <p>
                      <TextTitle>Unsub Text:</TextTitle>{" "}
                      {copy.unsubData.unsubscribeText}
                      <TextTitle>Unsub Link:</TextTitle>{" "}
                      {copy.unsubData.unsubscribeUrl}
                    </p>
                  )}
                  {copy.subjects && (
                    <p>
                      <TextTitle>Subjects:</TextTitle> {copy.subjects}
                    </p>
                  )}
                  {copy.imageLinks && copy.imageLinks?.length > 0 && (
                    <>
                      <p>
                        <TextTitle>
                          Images Found in Copy ({copy.imageLinks?.length})
                        </TextTitle>
                      </p>
                      <ImagesList>
                        {copy.imageLinks?.map((image) => (
                          <ImageCard key={image}>
                            <ImagePreviewContainer>
                              <img src={image} alt="image" />
                            </ImagePreviewContainer>

                            <DownloadButton
                              href={image}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <GrDownload color="white" />
                            </DownloadButton>

                            <FloatingLabelInput
                              placeholder="Paste new image link"
                              value={image}
                              onChange={(e) => handleImageSourceReplace()}
                            />

                            <ReplaceButton>Replace</ReplaceButton>
                          </ImageCard>
                        ))}
                      </ImagesList>
                    </>
                  )}

                  <AddButton onClick={() => setAddImageModal(true)}>
                    Add Image
                  </AddButton>
                </>
              )}
            </CopyCard>
          ))}
        </CopiesList>
      )}
    </Container>
  );
};

export default CopyMaker;
