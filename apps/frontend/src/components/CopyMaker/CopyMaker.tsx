import { useState } from "react";
import { Preset } from "../../types";
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
import AddImageModal from "../AddImageModal/AddImageModal";
import { ResponseCopy } from "../../types/copy-response";

interface Props {
  preset: Preset;
}

const CopyMaker: React.FC<Props> = ({ preset }) => {
  const [copies, setCopies] = useState<ResponseCopy[]>([]);
  const [loading, setLoading] = useState(false);
  const [addImageModal, setAddImageModal] = useState(false);
  const [imagesSource, setImagesSource] = useState<
    { copyName: string; imageLink: string }[]
  >([]);
  const [newImageLinks, setNewImageLinks] = useState<Record<string, string>>({});

  const [activeAddImageCopy, setActiveAddImageCopy] = useState<ResponseCopy>();

  const makeCopies = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/copy/make-multiple-copies`,
        {
          preset: preset,
        }
      );
      
      const imageSourceData: { copyName: string; imageLink: string }[] = [];
      response.data.forEach((copy: ResponseCopy) => {
        if (copy.imageLinks && copy.imageLinks.length > 0) {
          copy.imageLinks.forEach(imageLink => {
            imageSourceData.push({ copyName: copy.copyName, imageLink });
          });
        }
      });
      
      setImagesSource(imageSourceData);
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

  const handleImageSourceReplace = async (
    copyName: string,
    oldImageLink: string
  ) => {
    const newImageLink = newImageLinks[`${copyName}-${oldImageLink}`];
    
    if (!newImageLink) {
      toastError("Please enter a new image link first");
      return;
    }
    
    try {
      const copyIndex = copies.findIndex(copy => copy.copyName === copyName);
      if (copyIndex === -1) {
        toastError("Copy not found");
        return;
      }
      
      const updatedCopy = { ...copies[copyIndex] };

      updatedCopy.html = updatedCopy.html.replace(
        new RegExp(oldImageLink.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), 
        newImageLink
      );
      
      if (updatedCopy.imageLinks) {
        updatedCopy.imageLinks = updatedCopy.imageLinks.map(link => 
          link === oldImageLink ? newImageLink : link
        );
      }
      
      const newCopies = [...copies];
      newCopies[copyIndex] = updatedCopy;
      setCopies(newCopies);
      
      setImagesSource(prevImagesSource => 
        prevImagesSource.map(img => 
          (img.copyName === copyName && img.imageLink === oldImageLink) 
            ? { ...img, imageLink: newImageLink } 
            : img
        )
      );
      
      const newLinks = { ...newImageLinks };
      delete newLinks[`${copyName}-${oldImageLink}`];
      setNewImageLinks(newLinks);
      
      toastSuccess("Image replaced successfully");
    } catch (error) {
      toastError("Failed to replace image");
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setAddImageModal(false);
    setActiveAddImageCopy(undefined);
  };

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
                              value={newImageLinks[`${copy.copyName}-${image}`] || ''}
                              onChange={(e) => {
                                setNewImageLinks({
                                  ...newImageLinks,
                                  [`${copy.copyName}-${image}`]: e.target.value
                                });
                              }}
                            />

                            <ReplaceButton
                              onClick={() =>
                                handleImageSourceReplace(copy.copyName, image)
                              }
                            >
                              Replace
                            </ReplaceButton>
                          </ImageCard>
                        ))}
                      </ImagesList>
                    </>
                  )}

                  <AddButton onClick={() => {
                    setActiveAddImageCopy(copy);
                    setAddImageModal(true);
                  }}>
                    Add Image
                  </AddButton>
                </>
              )}
            </CopyCard>
          ))}
        </CopiesList>
      )}

      {addImageModal && activeAddImageCopy && (
        <AddImageModal 
          copy={activeAddImageCopy}
          copies={copies}
          setCopies={setCopies}
          imagesSource={imagesSource}
          setImagesSource={setImagesSource}
          onClose={handleCloseModal}
          isOpen={addImageModal}
          link={activeAddImageCopy.buildedLink}
        />
      )}
    </Container>
  );
};

export default CopyMaker;