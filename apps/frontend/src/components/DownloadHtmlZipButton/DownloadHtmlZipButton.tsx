import JSZip from "jszip";
import { saveAs } from "file-saver";
import { ResponseCopy } from "../../types/copy-response";
import { toastError } from "../../helpers/toastify";
import { DownloadButton } from "./DownloadHtmlZipButton.styled";
import { FaDownload } from "react-icons/fa6";

interface Props {
    copies: ResponseCopy[];
}

const DownloadHtmlZipButton: React.FC<Props> = ({ copies }) => {
  const handleDownloadZip = async () => {
    if (!copies || copies.length === 0) {
      toastError("No copies available to download.");
      return;
    }

    const zip = new JSZip();
    copies.forEach((copy) => {
      const fileName = `${copy.copyName}.html`;
      zip.file(fileName, copy.html);
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "copies_archive.zip");
  };

  return <DownloadButton onClick={handleDownloadZip}><FaDownload /></DownloadButton>;
};

export default DownloadHtmlZipButton;
