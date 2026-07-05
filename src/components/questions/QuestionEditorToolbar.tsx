import {
  applyFormatAndSync,
  insertFormula,
  insertTable,
  promptAndInsertImage,
  promptAndInsertLink,
} from "@/utils/richTextEditor";
import clsx from "clsx";
import {
  Bars3BottomLeftIcon,
  Bars3BottomRightIcon,
  Bars3CenterLeftIcon,
  Bars3Icon,
  BoldIcon,
  ItalicIcon,
  LinkIcon,
  ListBulletIcon,
  PhotoIcon,
  StrikethroughIcon,
  TableCellsIcon,
  UnderlineIcon,
  VariableIcon,
} from "@heroicons/react/24/outline";
import type { ReactNode, RefObject } from "react";

interface QuestionEditorToolbarProps {
  editorRef: RefObject<HTMLDivElement | null>;
  onChange: (value: string) => void;
}

type ToolbarActionId =
  | "italic"
  | "bold"
  | "underline"
  | "strikethrough"
  | "link"
  | "align-left"
  | "align-center"
  | "align-right"
  | "align-justify"
  | "list"
  | "table"
  | "formula"
  | "image";

interface ToolbarItem {
  id: ToolbarActionId;
  label: string;
  icon: ReactNode;
}

const TOOLBAR_ITEMS: ToolbarItem[] = [
  {
    id: "italic",
    label: "Italic",
    icon: <ItalicIcon className="h-4 w-4" aria-hidden="true" />,
  },
  {
    id: "bold",
    label: "Bold",
    icon: <BoldIcon className="h-4 w-4" aria-hidden="true" />,
  },
  {
    id: "underline",
    label: "Underline",
    icon: <UnderlineIcon className="h-4 w-4" aria-hidden="true" />,
  },
  {
    id: "strikethrough",
    label: "Strikethrough",
    icon: <StrikethroughIcon className="h-4 w-4" aria-hidden="true" />,
  },
  {
    id: "link",
    label: "Insert link",
    icon: <LinkIcon className="h-4 w-4" aria-hidden="true" />,
  },
  {
    id: "align-left",
    label: "Align left",
    icon: <Bars3BottomLeftIcon className="h-4 w-4" aria-hidden="true" />,
  },
  {
    id: "align-center",
    label: "Align center",
    icon: <Bars3CenterLeftIcon className="h-4 w-4" aria-hidden="true" />,
  },
  {
    id: "align-right",
    label: "Align right",
    icon: <Bars3BottomRightIcon className="h-4 w-4" aria-hidden="true" />,
  },
  {
    id: "align-justify",
    label: "Justify",
    icon: <Bars3Icon className="h-4 w-4" aria-hidden="true" />,
  },
  {
    id: "list",
    label: "Bullet list",
    icon: <ListBulletIcon className="h-4 w-4" aria-hidden="true" />,
  },
  {
    id: "table",
    label: "Insert table",
    icon: <TableCellsIcon className="h-4 w-4" aria-hidden="true" />,
  },
  {
    id: "formula",
    label: "Insert formula",
    icon: <VariableIcon className="h-4 w-4" aria-hidden="true" />,
  },
  {
    id: "image",
    label: "Insert image",
    icon: <PhotoIcon className="h-4 w-4" aria-hidden="true" />,
  },
];

export default function QuestionEditorToolbar({
  editorRef,
  onChange,
}: QuestionEditorToolbarProps) {
  const handleAction = (actionId: ToolbarActionId) => {
    const el = editorRef.current;
    if (!el) return;

    switch (actionId) {
      case "italic":
        applyFormatAndSync(el, "italic", onChange);
        break;
      case "bold":
        applyFormatAndSync(el, "bold", onChange);
        break;
      case "underline":
        applyFormatAndSync(el, "underline", onChange);
        break;
      case "strikethrough":
        applyFormatAndSync(el, "strikeThrough", onChange);
        break;
      case "link":
        promptAndInsertLink(el, onChange);
        break;
      case "align-left":
        applyFormatAndSync(el, "justifyLeft", onChange);
        break;
      case "align-center":
        applyFormatAndSync(el, "justifyCenter", onChange);
        break;
      case "align-right":
        applyFormatAndSync(el, "justifyRight", onChange);
        break;
      case "align-justify":
        applyFormatAndSync(el, "justifyFull", onChange);
        break;
      case "list":
        applyFormatAndSync(el, "insertUnorderedList", onChange);
        break;
      case "table":
        insertTable(el, onChange);
        break;
      case "formula":
        insertFormula(el, onChange);
        break;
      case "image":
        promptAndInsertImage(el, onChange);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border px-3 py-2">
      {TOOLBAR_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => handleAction(item.id)}
          title={item.label}
          aria-label={item.label}
          className={clsx(
            "flex h-8 w-8 cursor-pointer items-center justify-center rounded text-muted-foreground transition-colors",
            "hover:bg-primary/10 hover:text-primary"
          )}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
}
