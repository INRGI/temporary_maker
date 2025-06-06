/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import { Preset } from "../../../types/health";
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
  UnsubContainer,
} from "./CopyMaker.styled";
import { VscDebugStart } from "react-icons/vsc";
import { GrDownload } from "react-icons/gr";
import { BsCopy } from "react-icons/bs";
import axios from "axios";
import { toastError, toastSuccess } from "../../../helpers/toastify";
import Loader from "../../Common/Loader";
import FloatingLabelInput from "../../Common/FloatingLabelInput/FloatingLabelInput";
import AddImageModal from "../../Common/AddImageModal/AddImageModal";
import { ResponseCopy } from "../../../types/health/copy-response";
import DownloadHtmlZipButton from "../../Common/DownloadHtmlZipButton";
import PreviewAndEditModal from "../../Common/PreviewAndEditModal";
import { FaLink } from "react-icons/fa";
import BuildSpaceAdLink from "../BuildSpaceAdLink/BuildSpaceAdLink";
import { LinkIndicator } from "../../Common/LinkIndicator/LinkIndicator";
import { DateBadge } from "../../Common/DateBadge";
import MakeCopyModal from "../MakeCopyModal/MakeCopyModal";
import { TbRepeatOnce } from "react-icons/tb";
import { DateRangeButton } from "../../Common/DateRangeButton/DateRangeButton";
import { FaTrash } from "react-icons/fa6";
import UploadToWordpressButtonFromFile from "../UploadToWordpressButton/UploadToWordpressButtonFromFile";
import AntiSpamModal from "../AntiSpamModal/AntiSpamModal";
import { RiSpamLine } from "react-icons/ri";

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
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());

  const [activeAddImageCopy, setActiveAddImageCopy] = useState<ResponseCopy>();
  const [antiSpamModal, setAntiSpamModal] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);

  const [previewHtml, setPreviewHtml] = useState("");
  const [previewUnsubHtml, setPreviewUnsubHtml] = useState("");
  const [previewUnsubModal, setPreviewUnsubModal] = useState(false);
  const [buildLinkModal, setBuildLinkModal] = useState(false);
  const [makeCopyModal, setMakeCopyModal] = useState(false);

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);

  const STORAGE_KEY = "health-last-copies";

  const loadAllCopies = (): Record<string, ResponseCopy[]> => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};

      if (
        typeof parsed !== "object" ||
        Array.isArray(parsed) ||
        parsed === null
      ) {
        return {};
      }
      return parsed;
    } catch {
      return {};
    }
  };

  const saveAllCopies = (data: Record<string, ResponseCopy[]>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const saveCopiesForPreset = (presetName: string, copies: ResponseCopy[]) => {
    const all = loadAllCopies();
    all[presetName] = copies;
    saveAllCopies(all);
  };

  const loadCopiesForPreset = (presetName: string): ResponseCopy[] => {
    const all = loadAllCopies();
    return all[presetName] || [];
  };

  useEffect(() => {
    const stored = loadCopiesForPreset(preset.name);
    setCopies(stored);
    setHasLoadedFromStorage(true);
  }, [preset.name]);

  useEffect(() => {
    if (!hasLoadedFromStorage) return;
    if (copies.length === 0) return;
    saveCopiesForPreset(preset.name, copies);
  }, [copies]);

  const makeCopies = async () => {
    try {
      const [fromDate, toDate] = dateRange;

      const response = await axios.post(
        `/api/health/copy/make-multiple-copies`,
        {
          preset: preset,
          fromDate: fromDate ?? null,
          toDate: toDate ?? null,
        }
      );

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

      saveCopiesForPreset(preset.name, response.data);
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

      newCopies.map((copy) => {
        if (copy.copyName === copyName) {
          copy.html = updatedCopy.html;
          copy.imageLinks = updatedCopy.imageLinks;
        }
        return copy;
      });
      setCopies(newCopies);

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

    const hasPreview = imageUrl.endsWith("/preview");

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

  const handleNewSingleCopy = (newCopy: ResponseCopy) => {
    setCopies((prev) => [...prev, newCopy]);

    const imageSourceData: { copyName: string; imageLink: string }[] = [];

    if (newCopy.imageLinks && newCopy.imageLinks.length > 0) {
      newCopy.imageLinks.forEach((imageLink) => {
        imageSourceData.push({ copyName: newCopy.copyName, imageLink });
      });
    }

    setImagesSource(imageSourceData);
  };

  const handleClear = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      setCopies([]);
    } catch (error) {
      toastError("Failed to clear");
    }
  };

  return (
    <Container>
      <HeaderContainer>
        <ServicesBlockHeader>
          <h2>{preset.name}</h2>
        </ServicesBlockHeader>
        <ButtonsHeaderContainer>
          {copies.length > 0 && (
            <Button onClick={handleClear}>
              <FaTrash />
            </Button>
          )}
          <Button onClick={() => setAntiSpamModal(true)}>
            <RiSpamLine />
          </Button>
          {preset.linkUrl && (
            <Button onClick={() => setBuildLinkModal(true)}>
              <FaLink />
            </Button>
          )}
          <Button onClick={() => setMakeCopyModal(true)}>
            <TbRepeatOnce />
          </Button>
          {copies.length > 0 && (
            <DownloadHtmlZipButton copies={copies} presetName={preset.name} />
          )}
          <DateRangeButton onDateRangeChange={setDateRange} />

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
                <LinkIndicator link={copy.buildedLink} />
                <h2>{copy.copyName}</h2>
                <DateBadge date={copy.sendingDate} />
                <div>
                  {copy.html.includes("Error") || !copy.html ? (
                    <TextTitle>
                      {preset.format === "html"
                        ? "Html not found"
                        : "Mjml not found"}
                    </TextTitle>
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
              {!copy.html.includes("Error") && copy.html && (
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
                  {copy.subjects && copy.subjects.length > 0 ? (
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
                  ) : (
                    copy.subjects && (
                      <SubjectContainer>
                        <TextTitle>Subjects Not Found</TextTitle>
                      </SubjectContainer>
                    )
                  )}
                  {copy.imageLinks && copy.imageLinks?.length > 0 && (
                    <>
                      <p>
                        <TextTitle>
                          Images Found in Copy ({copy.imageLinks?.length})
                        </TextTitle>
                      </p>
                      <ImagesList>
                        {copy.imageLinks.map((image, index) => {
                          const imageKey = `${copy.copyName}-${image}-${index}`;

                          return (
                            <ImageCard key={imageKey}>
                              <ImagePreviewContainer
                                style={{
                                  border: brokenImages.has(imageKey)
                                    ? "2px solid red"
                                    : "none",
                                }}
                              >
                                <img
                                  src={image}
                                  alt="preview"
                                  onLoad={() =>
                                    setBrokenImages((prev) => {
                                      const newSet = new Set(prev);
                                      newSet.delete(imageKey);
                                      return newSet;
                                    })
                                  }
                                  onError={() =>
                                    setBrokenImages((prev) =>
                                      new Set(prev).add(imageKey)
                                    )
                                  }
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                  }}
                                />
                              </ImagePreviewContainer>

                              <DownloadButton
                                onClick={() => {
                                  if (!brokenImages.has(imageKey))
                                    handleDownloadImage(image);
                                }}
                                style={{
                                  cursor: brokenImages.has(imageKey)
                                    ? "not-allowed"
                                    : "pointer",
                                  opacity: brokenImages.has(imageKey) ? 0.6 : 1,
                                }}
                              >
                                <GrDownload color="white" />
                              </DownloadButton>

                              <FloatingLabelInput
                                placeholder="Paste new image link"
                                value={
                                  newImageLinks[`${copy.copyName}-${image}`] ||
                                  ""
                                }
                                onChange={(e) => {
                                  setNewImageLinks({
                                    ...newImageLinks,
                                    [`${copy.copyName}-${image}`]:
                                      e.target.value,
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
                              {preset.uploadImage &&
                                preset.uploadImage.isUploadImage && (
                                  <UploadToWordpressButtonFromFile
                                    onUploadMade={(url: string) =>
                                      setNewImageLinks({
                                        ...newImageLinks,
                                        [`${copy.copyName}-${image}`]: url,
                                      })
                                    }
                                    username={preset.uploadImage.username || ""}
                                    appPassword={
                                      preset.uploadImage.appPassword || ""
                                    }
                                    wordpressUrl={
                                      preset.uploadImage.wordpressUrl || ""
                                    }
                                  />
                                )}
                            </ImageCard>
                          );
                        })}
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
      {preset && makeCopyModal && (
        <MakeCopyModal
          onClose={() => setMakeCopyModal(false)}
          isOpen={makeCopyModal}
          preset={preset}
          onCopyMade={handleNewSingleCopy}
        />
      )}
      {antiSpamModal && (
        <AntiSpamModal
          onClose={() => setAntiSpamModal(false)}
          isOpen={antiSpamModal}
        />
      )}
    </Container>
  );
};

export default CopyMaker;
