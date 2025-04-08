import { useEffect, useState } from "react";
import { Preset } from "../../types";
import { ServicesBlockHeader } from "../PresetContainer/PresetContainer.styled";
import {
  AddButton,
  Button,
  ButtonContainer,
  ButtonsHeaderContainer,
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
  PreviewButton,
  ReplaceButton,
  Subject,
  SubjectContainer,
  Text,
  TextSpaceDivider,
  TextTitle,
  TitleCopy,
  UnsubContainer,
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
import DownloadHtmlZipButton from "../DownloadHtmlZipButton";
import PreviewAndEditModal from "../PreviewAndEditModal";
import { FaLink } from "react-icons/fa";
import BuildSpaceAdLink from "../BuildSpaceAdLink/BuildSpaceAdLink";

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
  const [newImageLinks, setNewImageLinks] = useState<Record<string, string>>(
    {}
  );

  const [activeAddImageCopy, setActiveAddImageCopy] = useState<ResponseCopy>();
  const [previewModal, setPreviewModal] = useState(false);
  const [previewUnsubModal, setPreviewUnsubModal] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewUnsubHtml, setPreviewUnsubHtml] = useState("");

  const [buildLinkModal, setBuildLinkModal] = useState(false);

  useEffect(() => {
    setCopies([]);
  }, [preset]);

  const makeCopies = async () => {
    try {
      const response = await axios.post(`/api/copy/make-multiple-copies`, {
        preset: preset,
      });

      const imageSourceData: { copyName: string; imageLink: string }[] = [];
      response.data.forEach((copy: ResponseCopy) => {
        if (copy.imageLinks && copy.imageLinks.length > 0) {
          copy.imageLinks.forEach((imageLink) => {
            imageSourceData.push({ copyName: copy.copyName, imageLink });
          });
        }
      });

      setImagesSource(imageSourceData);
      setCopies(response.data);
      toastSuccess(`Copies made successfully (${response.data.length})`);
    } catch (error) {
      toastError("Something went wrong");
      console.error(error);
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
      const copyIndex = copies.findIndex((copy) => copy.copyName === copyName);
      if (copyIndex === -1) {
        toastError("Copy not found");
        return;
      }

      const updatedCopy = { ...copies[copyIndex] };

      updatedCopy.html = updatedCopy.html.replace(
        new RegExp(oldImageLink.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
        newImageLink
      );

      if (updatedCopy.imageLinks) {
        updatedCopy.imageLinks = updatedCopy.imageLinks.map((link) =>
          link === oldImageLink ? newImageLink : link
        );
      }

      const newCopies = [...copies];
      newCopies[copyIndex] = updatedCopy;
      setCopies(newCopies);

      // Update imagesSource
      setImagesSource((prevImagesSource) =>
        prevImagesSource.map((img) =>
          img.copyName === copyName && img.imageLink === oldImageLink
            ? { ...img, imageLink: newImageLink }
            : img
        )
      );

      const newLinks = { ...newImageLinks };
      newLinks[`${copyName}-${newImageLink}`] = newImageLink;
      delete newLinks[`${copyName}-${oldImageLink}`];
      setNewImageLinks(newLinks);

      toastSuccess("Image replaced successfully");
    } catch (error) {
      toastError("Failed to replace image");
      console.error(error);
    }
  };

  const handleDownloadImage = async (imageUrl?: string) => {
    if (!imageUrl) {
      toastError("Failed to download image");
      return;
    }

    const hasPreview = imageUrl.includes("/preview");

    if (!hasPreview) {
      window.open(imageUrl, "_blank");
      return;
    }

    const correctedUrl = imageUrl.replace("/preview", "/download");

    try {
      const link = document.createElement("a");
      link.href = correctedUrl;
      link.download = "downloaded_image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toastError("Error downloading image");
    }
  };

  const handleCloseModal = () => {
    setAddImageModal(false);
    setActiveAddImageCopy(undefined);
  };

  const handleClosePreviewModal = () => {
    setPreviewModal(false);
  };

  const handleHtmlUpdate = (newHtml: string) => {
    const updatedCopies = [...copies];
    const index = updatedCopies.findIndex((copy) => copy.html === previewHtml);
    if (index !== -1) {
      updatedCopies[index].html = newHtml;
      setCopies(updatedCopies);
      setPreviewHtml(newHtml);
    }
  };

  const handleUnsubHtmlUpdate = (newHtml: string) => {
    const updatedCopies = copies.map((copy) => {
      if (
        copy.unsubData &&
        copy.unsubData.unsubscribeBuildedBlock === previewUnsubHtml
      ) {
        return {
          ...copy,
          unsubData: {
            ...copy.unsubData,
            unsubscribeBuildedBlock: newHtml,
          },
        };
      }
      return copy;
    });

    setCopies(updatedCopies);
    setPreviewUnsubHtml(newHtml);
  };

  return (
    <Container>
      <HeaderContainer>
        <ServicesBlockHeader>
          <h2>{preset.name}</h2>
        </ServicesBlockHeader>
        <ButtonsHeaderContainer>
          {preset.linkUrl && (
            <Button onClick={() => setBuildLinkModal(true)}>
              <FaLink />
            </Button>
          )}
          {copies.length > 0 && (
            <DownloadHtmlZipButton copies={copies} presetName={preset.name} />
          )}
          <Button onClick={() => handleMakeCopies()}>
            <VscDebugStart />
          </Button>
        </ButtonsHeaderContainer>
      </HeaderContainer>
      {loading ? (
        <Loader />
      ) : (
        <CopiesList>
          {copies.map((copy) => (
            <CopyCard key={copy.copyName}>
              <CardHeader>
                <h2>
                  {copy.copyName}
                  {copy.buildedLink.includes("IMG") && (
                    <TitleCopy
                      onClick={() => {
                        navigator.clipboard.writeText(
                          copy.buildedLink.match(/(IMG.*)/)?.[0] || ""
                        );
                        toastSuccess("Copied to clipboard");
                      }}
                    >
                      ({copy.buildedLink.match(/(IMG.*)/)?.[0] || ""})
                    </TitleCopy>
                  )}
                </h2>
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
                  {copy.unsubData && copy.unsubData?.unsubscribeText && (
                    <UnsubContainer>
                      <TextTitle>
                        Unsub Text:
                        <Text> {copy.unsubData.unsubscribeText}</Text>
                      </TextTitle>

                      {copy.unsubData.unsubscribeUrl && (
                        <TextTitle>
                          Unsub Link:
                          <Text> {copy.unsubData.unsubscribeUrl}</Text>
                        </TextTitle>
                      )}
                      {copy.unsubData.unsubscribeBuildedBlock && (
                        <ButtonContainer>
                          <TextTitle>Unsub Builded Block:</TextTitle>
                          <ButtonContainer>
                            <CopyButton
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  copy.unsubData
                                    ?.unsubscribeBuildedBlock as string
                                );
                                toastSuccess("Copied to clipboard");
                              }}
                              type="button"
                            >
                              <BsCopy />
                            </CopyButton>
                            <PreviewButton
                              onClick={() => {
                                setPreviewUnsubHtml(
                                  copy.unsubData
                                    ?.unsubscribeBuildedBlock as string
                                );
                                setPreviewUnsubModal(true);
                              }}
                            >
                              Preview
                            </PreviewButton>
                          </ButtonContainer>
                        </ButtonContainer>
                      )}
                    </UnsubContainer>
                  )}
                  {copy.subjects && (
                    <SubjectContainer>
                      <TextTitle>Subjects:</TextTitle>
                      {copy.subjects.map((subject, index) => (
                        <Subject
                          onClick={() => {
                            navigator.clipboard.writeText(subject);
                            toastSuccess("Copied to clipboard");
                          }}
                          key={index}
                        >
                          {subject}
                        </Subject>
                      ))}
                    </SubjectContainer>
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
                              <img src={image} alt="preview" />
                            </ImagePreviewContainer>

                            <DownloadButton
                              onClick={() => handleDownloadImage(image)}
                            >
                              <GrDownload color="white" />
                            </DownloadButton>

                            <FloatingLabelInput
                              placeholder="Paste new image link"
                              value={
                                newImageLinks[`${copy.copyName}-${image}`] || ""
                              }
                              onChange={(e) => {
                                setNewImageLinks({
                                  ...newImageLinks,
                                  [`${copy.copyName}-${image}`]: e.target.value,
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

                  <ButtonContainer>
                    <AddButton
                      onClick={() => {
                        setActiveAddImageCopy(copy);
                        setAddImageModal(true);
                      }}
                    >
                      Add Image
                    </AddButton>

                    <PreviewButton
                      onClick={() => {
                        setPreviewHtml(copy.html);
                        setPreviewModal(true);
                      }}
                    >
                      Preview
                    </PreviewButton>
                  </ButtonContainer>
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
      {previewModal && (
        <PreviewAndEditModal
          html={previewHtml}
          onClose={handleClosePreviewModal}
          isOpen={previewModal}
          onChange={handleHtmlUpdate}
        />
      )}
      {previewUnsubModal && (
        <PreviewAndEditModal
          html={previewUnsubHtml}
          onClose={() => setPreviewUnsubModal(false)}
          isOpen={previewUnsubModal}
          onChange={handleUnsubHtmlUpdate}
        />
      )}

      {preset.linkUrl && buildLinkModal && (
        <BuildSpaceAdLink
          onClose={() => setBuildLinkModal(false)}
          isOpen={buildLinkModal}
          linkUrl={preset.linkUrl}
        />
      )}
    </Container>
  );
};

export default CopyMaker;
