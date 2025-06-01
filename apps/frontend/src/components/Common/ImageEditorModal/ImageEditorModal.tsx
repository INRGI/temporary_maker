import { useRef, useState } from "react";
import { toastSuccess } from "../../../helpers/toastify";
import AdminModal from "../AdminModal";
import {
  StyledCanvas,
  ExportButton,
  CanvasArea,
  TemplateButton,
  EditorLayout,
  PanelTitle,
  FileInput,
  Label,
  TemplateList,
  Sidebar,
} from "./ImageEditorModal.styled";

interface Template {
  id: string;
  name: string;
  src: string;
}

interface Props {
  onClose: () => void;
  isOpen: boolean;
}

const templates: Template[] = [
  { id: "yt", name: "YouTube Button", src: "/templates/youtube-button.png" },
  { id: "news", name: "News Badge", src: "/templates/news-badge.png" },
  { id: "watch now", name: "Watch Now", src: "/templates/watch-now.png" },
];

const ImageEditorModal: React.FC<Props> = ({ onClose, isOpen }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [blurBackground, setBlurBackground] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setUploadedImage(reader.result);
        drawImage(reader.result, selectedTemplate, blurBackground);
      }
    };
    reader.readAsDataURL(file);
  };

  const drawImage = (src: string, template: Template | null, blur: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.filter = blur ? "blur(6px)" : "none";
      ctx.drawImage(img, 0, 0);
      ctx.filter = "none";
      if (template) {
        const overlay = new Image();
        overlay.src = template.src;
        if (template.id === "news") {
          const scale = 1 / 7;
          const w = overlay.width * scale;
          const h = overlay.height * scale;
          const padding = 20;
          const x = img.width - w - padding;
          const y = padding;
          ctx.drawImage(overlay, x, y, w, h);
        } else {
          overlay.onload = () => {
            const w = img.width / 2;
            const h = overlay.height * (w / overlay.width);
            const x = (img.width - w) / 2;
            const y = (img.height - h) / 2;
            ctx.drawImage(overlay, x, y, w, h);
          };
        }
      } else {
        toastSuccess("Image loaded");
      }
    };
  };

  const exportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.download = `${Date.now()}.png`;
    a.href = url;
    a.click();
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setUploadedImage("");
        setSelectedTemplate(null);
        setBlurBackground(false);
      }}
    >
      <EditorLayout>
        <Sidebar>
          <PanelTitle>Upload</PanelTitle>
          <FileInput
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />

          <PanelTitle>Effects</PanelTitle>
          <Label>
            <input
              type="checkbox"
              checked={blurBackground}
              onChange={() => {
                const next = !blurBackground;
                setBlurBackground(next);
                if (uploadedImage)
                  drawImage(uploadedImage, selectedTemplate, next);
              }}
            />
            Blur background
          </Label>

          <PanelTitle>Templates</PanelTitle>
          <TemplateList>
            {templates.map((tpl) => (
              <TemplateButton
                key={tpl.id}
                active={selectedTemplate?.id === tpl.id}
                onClick={() => {
                  setSelectedTemplate(tpl);
                  if (uploadedImage)
                    drawImage(uploadedImage, tpl, blurBackground);
                }}
              >
                {tpl.name}
              </TemplateButton>
            ))}
          </TemplateList>

          <ExportButton onClick={exportImage}>Export Image</ExportButton>
        </Sidebar>

        <CanvasArea>
          <StyledCanvas ref={canvasRef} />
        </CanvasArea>
      </EditorLayout>
    </AdminModal>
  );
};

export default ImageEditorModal;
