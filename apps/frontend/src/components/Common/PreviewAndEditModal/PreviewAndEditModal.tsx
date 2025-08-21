import { useEffect, useMemo, useRef, useState } from "react";
import AdminModal from "../AdminModal";
import Editor from "@monaco-editor/react";
import { FaBold, FaItalic, FaLink, FaRegImage } from "react-icons/fa6";
import {
  ActiveOverlay,
  BottomToolbar,
  Button,
  HtmlPane,
  Input,
  Label,
  ModalContainer,
  Overlay,
  PreviewPadding,
  PreviewPane,
  Row,
  Select,
  TinyBtn,
  Toolbar,
} from "./PreviewAndEditModal.styled";

interface Props {
  html: string;
  onClose: () => void;
  isOpen: boolean;
  onChange: (newHtml: string) => void;
}

const FONT_FAMILIES = [
  "inherit",
  "Roboto, Arial, Helvetica, sans-serif",
  "Tahoma, Geneva, sans-serif",
  "Georgia, serif",
  "Times New Roman, Times, serif",
  "Verdana, Geneva, sans-serif",
  "Monaco, Menlo, Consolas, monospace",
];
const FONT_SIZES = [
  "inherit",
  "8px",
  "10px",
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
  "36px",
  "40px",
  "44px",
  "48px",
];

const ALLOWED_TAGS = new Set([
  "TD",
  "A",
  "SPAN",
  "B",
  "I",
  "STRONG",
  "EM",
  "IMG",
  "P",
  "DIV",
  "LI",
  "UL",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "TABLE",
  "TR",
  "TBODY",
  "THEAD",
  "TFOOT",
]);

function parseStyleAttr(styleStr: string) {
  const out: Record<string, string> = {};
  styleStr
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((pair) => {
      const [k, v] = pair.split(":");
      if (k && v) out[k.trim().toLowerCase()] = v.trim();
    });
  return out;
}
function styleObjToString(obj: Record<string, string>) {
  return Object.entries(obj)
    .filter(([, v]) => v !== "" && v != null)
    .map(([k, v]) => `${k}: ${v}`)
    .join("; ");
}
function patchInlineStyle(
  el: HTMLElement,
  patch: Partial<CSSStyleDeclaration>
) {
  const cur = parseStyleAttr(el.getAttribute("style") || "");
  const set = (cssKey: string, value?: string | null) => {
    if (!value || value === "inherit") delete cur[cssKey];
    else cur[cssKey] = value;
  };
  if (patch.fontFamily !== undefined)
    set("font-family", patch.fontFamily || null);
  if (patch.fontSize !== undefined) set("font-size", patch.fontSize || null);
  if (patch.fontWeight !== undefined)
    set("font-weight", patch.fontWeight || null);
  if (patch.fontStyle !== undefined) set("font-style", patch.fontStyle || null);
  if (patch.color !== undefined) set("color", patch.color || null);
  if (patch.textDecoration !== undefined)
    set("text-decoration", patch.textDecoration || null);
  if (patch.width !== undefined) set("width", patch.width || null);
  if (patch.maxWidth !== undefined) set("max-width", patch.maxWidth || null);

  const str = styleObjToString(cur);
  if (str) el.setAttribute("style", str);
  else el.removeAttribute("style");
}

function closestAllowedBounded(
  root: HTMLElement,
  start: Element | null
): HTMLElement | null {
  let cur: Element | null = start;
  while (cur && cur instanceof HTMLElement) {
    if (!root.contains(cur)) return null;
    if (ALLOWED_TAGS.has(cur.tagName)) return cur;
    cur = cur.parentElement;
  }
  return null;
}

type NodePath = number[];
function getNodePath(root: HTMLElement, el: HTMLElement): NodePath {
  const path: number[] = [];
  let cur: HTMLElement | null = el;
  while (cur && cur !== root) {
    const parent = cur.parentElement as HTMLElement | null;
    if (!parent) break;
    const idx = Array.from(parent.children).indexOf(cur);
    path.push(idx);
    cur = parent;
  }
  return path.reverse();
}
function resolveNodePath(
  root: HTMLElement,
  path: NodePath
): HTMLElement | null {
  let cur: Element | null = root;
  for (const idx of path) {
    if (!cur || !cur.children || !cur.children[idx]) return null;
    cur = cur.children[idx];
  }
  return (cur as HTMLElement) || null;
}

function addClass(el: HTMLElement, className: string) {
  const prev = el.getAttribute("class") || "";
  const classes = new Set(prev.split(/\s+/).filter(Boolean));
  if (!classes.has(className)) {
    classes.add(className);
    el.setAttribute("class", Array.from(classes).join(" "));
  }
}

const PreviewAndEditModal: React.FC<Props> = ({
  html,
  onClose,
  isOpen,
  onChange,
}) => {
  const [localHtml, setLocalHtml] = useState(html || "");
  const [activeEl, setActiveEl] = useState<HTMLElement | null>(null);

  const [fontFamily, setFontFamily] = useState("inherit");
  const [fontSize, setFontSize] = useState("inherit");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [manualColor, setManualColor] = useState("");

  const paneRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hoverBoxRef = useRef<HTMLDivElement>(null);
  const activeBoxRef = useRef<HTMLDivElement>(null);

  const [imageWidth, setImageWidth] = useState("");
  const [imageMaxWidth, setImageMaxWidth] = useState("");

  useEffect(() => {
    setLocalHtml(html || "");
    setActiveEl(null);
  }, [html]);

  const drawBox = (box: HTMLDivElement | null, el: HTMLElement | null) => {
    const pane = paneRef.current;
    if (!box || !pane || !el) {
      if (box) box.style.display = "none";
      return;
    }
    const er = el.getBoundingClientRect();
    const pr = pane.getBoundingClientRect();
    box.style.display = "block";
    box.style.top = `${pane.scrollTop + (er.top - pr.top)}px`;
    box.style.left = `${pane.scrollLeft + (er.left - pr.left)}px`;
    box.style.width = `${er.width}px`;
    box.style.height = `${er.height}px`;
  };
  const drawHoverBox = (el: HTMLElement | null) =>
    drawBox(hoverBoxRef.current, el);
  const drawActiveBox = (el: HTMLElement | null) =>
    drawBox(activeBoxRef.current, el);

  const publish = (keepPath?: NodePath) => {
    const out = contentRef.current?.innerHTML ?? "";
    if (out !== localHtml) setLocalHtml(out);
    onChange(out);
    if (keepPath && contentRef.current) {
      const restored = resolveNodePath(contentRef.current, keepPath);
      setActiveEl(restored);
      drawActiveBox(restored);
      drawHoverBox(restored);
    }
  };

  const stopLinkNav = (e: any) => {
    if (!contentRef.current) return;
    const t = e.target as Element | null;
    if (
      t &&
      contentRef.current.contains(t) &&
      (t.closest("a") || t.tagName === "A")
    ) {
      e.preventDefault?.();
      e.stopPropagation?.();
      return false;
    }
  };

  const onMouseMoveCapture = (e: React.MouseEvent) => {
    if (!contentRef.current) return;
    const el = closestAllowedBounded(contentRef.current, e.target as Element);
    drawHoverBox(el);
  };

  const onClickCapture = (e: React.MouseEvent) => {
    stopLinkNav(e);
    if (!contentRef.current) return;
    const el = closestAllowedBounded(contentRef.current, e.target as Element);
    setActiveEl(el || null);
    drawActiveBox(el || null);

    if (el) {
      const s = parseStyleAttr(el.getAttribute("style") || "");
      setFontFamily(s["font-family"] || "inherit");
      setFontSize(s["font-size"] || "inherit");
      setBold(
        (s["font-weight"] || "").toLowerCase() === "bold" ||
          parseInt(s["font-weight"] || "0", 10) >= 600
      );
      setItalic((s["font-style"] || "").toLowerCase() === "italic");
      setManualColor(s["color"] || "");

      if (el.tagName === "IMG") {
        setImageWidth(s["width"] || el.getAttribute("width") || "");
        setImageMaxWidth(s["max-width"] || el.getAttribute("max-width") || "");
      } else {
        setImageWidth("");
        setImageMaxWidth("");
      }
    } else {
      setFontFamily("inherit");
      setFontSize("inherit");
      setBold(false);
      setItalic(false);
      setManualColor("");
      setImageWidth("");
    }
  };

  const onKeyDownCapture = (e: React.KeyboardEvent) => {
    if (!contentRef.current) return;
    const t = e.target as Element | null;
    if (t && (t.closest("a") || t.tagName === "A")) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  };

  const onScroll = () => {
    drawHoverBox(null);
    drawActiveBox(activeEl);
  };

  const applyToActive = (patch: Partial<CSSStyleDeclaration>) => {
    if (!activeEl || !contentRef.current) return;
    const path = getNodePath(contentRef.current, activeEl);
    patchInlineStyle(activeEl, patch);
    publish(path);

    setTimeout(() => {
      if (contentRef.current) {
        const restored = resolveNodePath(contentRef.current, path);
        if (restored) {
          setActiveEl(restored);
        }
      }
    }, 0);
  };

  const onFontFamilyChange = (v: string) => {
    setFontFamily(v);
    applyToActive({ fontFamily: v === "inherit" ? "" : v });
  };
  const onFontSizeChange = (v: string) => {
    setFontSize(v);
    applyToActive({ fontSize: v === "inherit" ? "" : v });
  };
  const toggleBold = () => {
    const next = !bold;
    setBold(next);
    applyToActive({ fontWeight: next ? "bold" : "" });
  };
  const toggleItalic = () => {
    const next = !italic;
    setItalic(next);
    applyToActive({ fontStyle: next ? "italic" : "" });
  };
  const onColorChange = (v: string) => {
    setManualColor(v);
    applyToActive({ color: v.trim() || "" });
  };

  const addEsButtonClass = () => {
    if (!activeEl || activeEl.tagName !== "A" || !contentRef.current) return;
    const path = getNodePath(contentRef.current, activeEl);
    addClass(activeEl, "es-button");

    publish(path);
  };

  const selectParent = () => {
    if (!activeEl || !contentRef.current) return;
    const p = closestAllowedBounded(contentRef.current, activeEl.parentElement);
    if (!p) return;
    setActiveEl(p);
    drawActiveBox(p);
    const s = parseStyleAttr(p.getAttribute("style") || "");
    setFontFamily(s["font-family"] || "inherit");
    setFontSize(s["font-size"] || "inherit");
    setBold(
      (s["font-weight"] || "").toLowerCase() === "bold" ||
        parseInt(s["font-weight"] || "0", 10) >= 600
    );
    setItalic((s["font-style"] || "").toLowerCase() === "italic");
    setManualColor(s["color"] || "");
  };
  const selectFirstChild = () => {
    if (!activeEl || !contentRef.current) return;
    let cur: Element | null = activeEl.firstElementChild;
    while (cur) {
      const allowed = closestAllowedBounded(contentRef.current, cur);
      if (allowed) {
        setActiveEl(allowed);
        drawActiveBox(allowed);
        const s = parseStyleAttr(allowed.getAttribute("style") || "");
        setFontFamily(s["font-family"] || "inherit");
        setFontSize(s["font-size"] || "inherit");
        setBold(
          (s["font-weight"] || "").toLowerCase() === "bold" ||
            parseInt(s["font-weight"] || "0", 10) >= 600
        );
        setItalic((s["font-style"] || "").toLowerCase() === "italic");
        setManualColor(s["color"] || "");
        return;
      }
      cur = cur.nextElementSibling;
    }
  };
  const onImageWidthChange = (v: string) => {
    setImageWidth(v);
    if (activeEl && activeEl.tagName === "IMG") {
      applyToActive({ width: v.trim() || "" });
    }
  };

  const onImageMaxWidthChange = (v: string) => {
    setImageMaxWidth(v);
    if (activeEl && activeEl.tagName === "IMG") {
      applyToActive({ maxWidth: v.trim() || "" });
    }
  };

  const monacoOptions = useMemo(
    () => ({
      minimap: { enabled: false },
      fontSize: 14,
      scrollBeyondLastLine: false,
      automaticLayout: true,
    }),
    []
  );
  const onMonacoChange = (value?: string) => {
    const next = value ?? "";
    if (next !== localHtml) setLocalHtml(next);
    setActiveEl(null);
    drawActiveBox(null);
    drawHoverBox(null);
  };

  return (
    <AdminModal isOpen={isOpen} onClose={onClose}>
      <ModalContainer>
        <PreviewPane ref={paneRef} onScroll={onScroll}>
          <Toolbar>
            <TinyBtn onClick={selectParent} title="Move to parent">
              ⬆︎
            </TinyBtn>
            <TinyBtn onClick={selectFirstChild} title="Move to first child">
              ⬇︎
            </TinyBtn>
            <Row>
              <Label>Font family</Label>
              <Select
                value={fontFamily}
                onChange={(e) => onFontFamilyChange(e.target.value)}
              >
                {FONT_FAMILIES.map((ff) => (
                  <option key={ff} value={ff}>
                    {ff === "inherit" ? "inherit" : ff.split(",")[0]}
                  </option>
                ))}
              </Select>
            </Row>

            <Row>
              <Label>Font size</Label>
              <Select
                value={fontSize}
                onChange={(e) => onFontSizeChange(e.target.value)}
              >
                {FONT_SIZES.map((fs) => (
                  <option key={fs} value={fs}>
                    {fs}
                  </option>
                ))}
              </Select>
            </Row>

            <Row>
              <Label>Style</Label>
              <Button onClick={toggleBold} active={bold} title="Bold">
                <FaBold />
              </Button>
              <Button onClick={toggleItalic} active={italic} title="Italic">
                <FaItalic />
              </Button>
            </Row>

            <Row>
              <Label>Color</Label>
              <Input
                placeholder="e.g. #333333"
                value={manualColor}
                onChange={(e) => onColorChange(e.target.value)}
              />
            </Row>
          </Toolbar>

          <PreviewPadding>
            <div
              ref={contentRef}
              dangerouslySetInnerHTML={{ __html: localHtml }}
              onMouseMoveCapture={onMouseMoveCapture}
              onClickCapture={onClickCapture}
              onKeyDownCapture={onKeyDownCapture}
              onAuxClickCapture={stopLinkNav as any}
            />
          </PreviewPadding>

          <Overlay ref={hoverBoxRef} style={{ display: "none" }} />
          <ActiveOverlay ref={activeBoxRef} style={{ display: "none" }} />

          {activeEl && activeEl.tagName === "IMG" && (
            <BottomToolbar>
              <Row>
                <FaRegImage />
              </Row>
              <Row>
                <Label>Width</Label>
                <Input
                  placeholder="e.g. 200px"
                  value={imageWidth}
                  onChange={(e) => onImageWidthChange(e.target.value)}
                />
              </Row>
              <Row>
                <Label>Max Width</Label>
                <Input
                  placeholder="e.g. 200px"
                  value={imageMaxWidth}
                  onChange={(e) => onImageMaxWidthChange(e.target.value)}
                />
              </Row>
            </BottomToolbar>
          )}
          {activeEl && activeEl.tagName === "A" && (
            <BottomToolbar>
              <Row>
                <FaLink />
              </Row>

              <Row>
                <Button
                  onClick={addEsButtonClass}
                  title='Add class "es-button"'
                >
                  add es-button
                </Button>
              </Row>
            </BottomToolbar>
          )}
        </PreviewPane>

        <HtmlPane>
          <Editor
            height="100%"
            defaultLanguage="html"
            theme="vs-light"
            value={localHtml}
            onChange={onMonacoChange}
            options={monacoOptions}
          />
        </HtmlPane>
      </ModalContainer>
    </AdminModal>
  );
};

export default PreviewAndEditModal;
