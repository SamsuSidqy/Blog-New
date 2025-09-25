"use client";

import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
} from "react";
import isHotkey from "is-hotkey";
import {
  createEditor,
  Editor,
  Transforms,
  Node,
  Element as SlateElement,
} from "slate";
import {
  Slate,
  Editable,
  withReact,
  useSlate,
} from "slate-react";
import { withHistory } from "slate-history";
import { FaJava, FaPhp, FaPython } from "react-icons/fa";

import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";
import php from "highlight.js/lib/languages/php";
import java from "highlight.js/lib/languages/java";
import python from "highlight.js/lib/languages/python";
import "highlight.js/styles/atom-one-dark.css";

import { serialize } from "./utils/SlateSerialize";
import { styleMap } from "./utils/styleSlate";

// ────────────────────────────── //
//  Register Highlight.js Languages
// ────────────────────────────── //
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("java", java);
hljs.registerLanguage("php", php);

// ────────────────────────────── //
//  Constants
// ────────────────────────────── //
const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

// ────────────────────────────── //
//  Editor Component
// ────────────────────────────── //
export default function RichTextEditor() {
  const editor = useMemo(
    () => withFallbackNormalization(withHistory(withReact(createEditor()))),
    []
  );
  const [value, setValue] = useState(initialValue);

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  // Auto-select first paragraph if editor is empty
  useEffect(() => {
    if (
      value.length === 0 ||
      (value.length === 1 &&
        value[0].type === "paragraph" &&
        value[0].children?.[0]?.text === "")
    ) {
      setTimeout(() => {
        Transforms.select(editor, Editor.start(editor, [0]));
      }, 0);
    }
  }, [value, editor]);

  return (
    <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
      <Button onMouseDown={() => console.log(serialize(value))}>
        Check
      </Button>

      {/* Editor */}
      <div style={{ flex: 1 }}>
        <Slate
          editor={editor}
          initialValue={value}
          onChange={(newValue) => setValue(newValue)}
        >
          <Toolbar>
            <MarkButton format="bold" icon="B" />
            <MarkButton format="italic" icon="I" />
            <MarkButton format="underline" icon="U" />
            <BlockButton format="heading-one" icon="H1" />
            <BlockButton format="heading-two" icon="H2" />
            <BlockButton format="block-quote" icon="❝" />
            <BlockButton format="numbered-list" icon="1." />
            <BlockButton format="bulleted-list" icon="•" />
            <BlockButton format="code" icon="</>" />
          </Toolbar>

          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Tulis sesuatu..."
            spellCheck
            autoFocus
            onKeyDown={(event) => {
              for (const hotkey in HOTKEYS) {
                if (isHotkey(hotkey, event)) {
                  event.preventDefault();
                  toggleMark(editor, HOTKEYS[hotkey]);
                }
              }
            }}
            onPaste={(event) => {
              const text = event.clipboardData.getData("text/plain");
              if (text.includes("\n")) {
                event.preventDefault();
                const codeBlock = {
                  type: "code",
                  language: "javascript",
                  children: [{ text }],
                };
                Transforms.insertNodes(editor, codeBlock);
              }
            }}
          />
        </Slate>
      </div>

      {/* Preview */}
      <div style={{ flex: 1 }}>
        <h1>Preview</h1>
        {value.map((node, i) => (
          <PreviewNode key={i} node={node} />
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────── //
//  Helpers - Marks
// ────────────────────────────── //
const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);
  isActive
    ? Editor.removeMark(editor, format)
    : Editor.addMark(editor, format, true);
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

// ────────────────────────────── //
//  Helpers - Blocks
// ────────────────────────────── //
const toggleBlock = (editor, format) => {
  const isAlign = TEXT_ALIGN_TYPES.includes(format);
  const isActive = isBlockActive(editor, format, isAlign ? "align" : "type");
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      (LIST_TYPES.includes(n.type) || n.type === "code"),
    split: true,
  });

  const newProps = isAlign
    ? { align: isActive ? undefined : format }
    : { type: isActive ? "paragraph" : format };

  Transforms.setNodes(editor, newProps);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const isBlockActive = (editor, format, blockType = "type") => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        (blockType === "align" ? n.align === format : n.type === format),
    })
  );

  return !!match;
};

const withFallbackNormalization = (editor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    if (SlateElement.isElement(node) && node.children.length === 0) {
      Transforms.insertNodes(editor, { text: "" }, { at: path.concat(0) });
      return;
    }
    normalizeNode([node, path]);
  };

  return editor;
};

// ────────────────────────────── //
//  UI Components
// ────────────────────────────── //
const Toolbar = ({ children }) => (
  <div style={{ borderBottom: "1px solid #ccc", marginBottom: "1rem" }}>
    {children}
  </div>
);

const Button = ({ active, onMouseDown, children }) => (
  <button
    style={{
      backgroundColor: active ? "#ddd" : "transparent",
      border: "none",
      padding: "0.5rem",
      cursor: "pointer",
      fontWeight: active ? "bold" : "normal",
    }}
    onMouseDown={(e) => {
      e.preventDefault();
      onMouseDown();
    }}
  >
    {children}
  </button>
);

const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={() => toggleMark(editor, format)}
    >
      {icon}
    </Button>
  );
};

const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
      )}
      onMouseDown={() => toggleBlock(editor, format)}
    >
      {icon}
    </Button>
  );
};

const CodeButton = ({ format }) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(editor, "code")}
      onMouseDown={() => {
        const codeBlock = {
          type: "code",
          language: format,
          children: [{ text: "" }],
        };
        Transforms.insertNodes(editor, codeBlock);
      }}
    >
      {format === "java" && <FaJava />}
      {format === "php" && <FaPhp />}
      {format === "python" && <FaPython />}
    </Button>
  );
};

// ────────────────────────────── //
//  Rendering Elements
// ────────────────────────────── //
const Element = ({ attributes, children, element }) => {
  const baseStyle = styleMap[element.type] || {};
  const alignStyle = element.align ? styleMap.align[element.align] : {};
  const combinedStyle = { ...baseStyle, ...alignStyle };

  switch (element.type) {
    case "block-quote":
      return (
        <blockquote
          className="bg-white text-black p-4 italic font-bold border-l-4 border-indigo-500"
          {...attributes}
        >
          {children}
        </blockquote>
      );
    case "heading-one":
      return <h1 style={combinedStyle} {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 style={combinedStyle} {...attributes}>{children}</h2>;
    case "numbered-list":
      return <ol style={combinedStyle} {...attributes}>{children}</ol>;
    case "bulleted-list":
      return <ul style={combinedStyle} {...attributes}>{children}</ul>;
    case "list-item":
      return <li style={combinedStyle} {...attributes}>{children}</li>;
    case "code":
      const codeText = Node.string(element);
      const highlightedCode = hljs.highlightAuto(codeText).value;
      return (
        <pre style={combinedStyle} {...attributes}>
          <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
        </pre>
      );
    default:
      return <p style={combinedStyle} {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) children = <u>{children}</u>;
  return <span {...attributes}>{children}</span>;
};

// ────────────────────────────── //
//  Preview Component
// ────────────────────────────── //
const PreviewNode = ({ node }) => {
  const getText = (n) =>
    n.children?.map((leaf) => leaf.text).join("") ?? "";

  const alignStyle = node.align ? styleMap.align[node.align] : {};
  const combinedStyle = { ...(styleMap[node.type] || {}), ...alignStyle };

  if (node.type === "code") {
    const code = getText(node);
    const highlighted = hljs.highlightAuto(code).value;
    return (
      <pre style={styleMap.code}>
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    );
  }

  if (node.type === "heading-one") {
    return <h1 style={combinedStyle}>{getText(node)}</h1>;
  }

  if (node.type === "heading-two") {
    return <h2 style={combinedStyle}>{getText(node)}</h2>;
  }

  if (node.type === "block-quote") {
    return (
      <blockquote className="bg-white text-black p-4 italic font-bold border-l-4 border-indigo-500">
        {getText(node)}
      </blockquote>
    );
  }

  if (node.type === "numbered-list") {
    return (
      <ol style={combinedStyle}>
        {node.children?.map((child, idx) => (
          <li key={idx} style={styleMap["list-item"]}>
            {getText(child)}
          </li>
        ))}
      </ol>
    );
  }

  if (node.type === "bulleted-list") {
    return (
      <ul style={combinedStyle}>
        {node.children?.map((child, idx) => (
          <li key={idx} style={styleMap["list-item"]}>
            {getText(child)}
          </li>
        ))}
      </ul>
    );
  }

  if (node.type === "paragraph") {
    const text = getText(node);
    const paragraphs = text.split(/\n{2,}/);
    return (
      <div style={{ marginBottom: "1rem" }}>
        {paragraphs.map((para, idx) => {
          const lines = para.split("\n");
          return (
            <p key={idx} className="text-justify" style={combinedStyle}>
              {lines.map((line, lineIdx) => (
                <React.Fragment key={lineIdx}>
                  {line}
                  {lineIdx < lines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          );
        })}
      </div>
    );
  }

  return (
    <p className="text-justify" style={combinedStyle}>
      {getText(node)}
    </p>
  );
};
