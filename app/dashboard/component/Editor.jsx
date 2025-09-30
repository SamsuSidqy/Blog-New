"use client";

import React, { useCallback, useMemo, useEffect } from "react";
import isHotkey from "is-hotkey";
import {
  createEditor,
  Editor,
  Transforms,
  Node,
  Element as SlateElement,
  Range,
} from "slate";
import { Slate, Editable, withReact, useSlate, ReactEditor  } from "slate-react";
import { withHistory } from "slate-history";

import { FaJava, FaPhp, FaPython, FaImages } from "react-icons/fa";

import hljs from "highlight.js";
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml'; // Untuk JSX/HTML
import golang from 'highlight.js/lib/languages/go';
import python from 'highlight.js/lib/languages/python';
import php from 'highlight.js/lib/languages/php';
import java from 'highlight.js/lib/languages/java';
import shell from 'highlight.js/lib/languages/shell';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('jsx', xml);         // JSX pakai xml
hljs.registerLanguage('tsx', typescript);  // TSX pakai typescript
hljs.registerLanguage('html', xml);
hljs.registerLanguage('go', golang);
hljs.registerLanguage('python', python);
hljs.registerLanguage('php', php);
hljs.registerLanguage('java', java);
hljs.registerLanguage('shell', shell);
hljs.registerLanguage('bash', shell);

import "highlight.js/styles/atom-one-dark.css";

import { styleMap } from "./utils/styleSlate"; // Pastikan ini tersedia



const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

export default function RichTextEditor({ onChange, value }) {
  const editor = useMemo(
    () => withFallbackNormalization(withHistory(withReact(createEditor()))),
    []
  );

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  // Jika kosong, insert paragraph kosong
  useEffect(() => {
    if (!value || value.length === 0) {
      onChange([
        {
          type: "paragraph",
          children: [{ text: "" }],
        },
      ]);
    }

    
  }, [value]);

  // Helper hapus block kode dan insert paragraph baru di tempat sama
  const removeBlockAndInsertParagraph = (path) => {
    Transforms.removeNodes(editor, { at: path });
    Transforms.insertNodes(
      editor,
      { type: "paragraph", children: [{ text: "" }] },
      { at: path }
    );
    Transforms.select(editor, Editor.start(editor, path));
  };

  

  return (
    <div className="text-black mb-10">
      <Slate editor={editor} initialValue={value} value={value} onChange={onChange}>
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
          <ImageButton format="image-util" />
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
                return;
              }
            }

            // Enter dalam block code hanya insert \n
            if (event.key === "Enter") {
              const [match] = Editor.nodes(editor, {
                match: (n) => SlateElement.isElement(n) && n.type === "code",
              });
              if (match) {
                event.preventDefault();
                Editor.insertText(editor, "\n");
                return;
              }
              const [listItemMatch] = Editor.nodes(editor, {
                match: (n) => SlateElement.isElement(n) && n.type === "list-item",
              });

              if (listItemMatch) {
                const [node, path] = listItemMatch;
                const isEmpty = Node.string(node).trim() === "";

                if (isEmpty) {
                  // Jika list-item kosong → keluar dari list
                  event.preventDefault();

                  // Unwrap dari list (ul/ol)
                  Transforms.unwrapNodes(editor, {
                    match: (n) =>
                      !Editor.isEditor(n) &&
                      SlateElement.isElement(n) &&
                      LIST_TYPES.includes(n.type),
                    split: true,
                  });

                  // Ubah menjadi paragraph
                  Transforms.setNodes(editor, {
                    type: "paragraph",
                  });

                  return;
                } else {
                  // Jika tidak kosong → buat list-item baru
                  event.preventDefault();
                  Transforms.splitNodes(editor, { always: true });
                  return;
                }
              }
            }

            // Contoh hapus code block kosong
            if (
              (event.key === "Backspace" || event.key === "Delete") &&
              editor.selection
            ) {
              const [blockEntry] = Editor.nodes(editor, {
                match: (n) => SlateElement.isElement(n),
                mode: "lowest",
              });
              if (blockEntry) {
                const [node, path] = blockEntry;
                if (
                  SlateElement.isElement(node) &&
                  node.type === "code" &&
                  Node.string(node).length === 0
                ) {
                  event.preventDefault();
                  removeBlockAndInsertParagraph(path);
                  return;
                }
              }
            }
          }}
          onPaste={(event) => {
            event.preventDefault();

            const text = event.clipboardData.getData("text/plain");

            // Split berdasarkan newline
            const lines = text.split(/\r?\n/);

            // Buat array of paragraph nodes
            const paragraphs = lines.map((line) => ({
              type: "paragraph",
              children: [{ text: line }],
            }));

            // Insert ke editor
            Transforms.insertNodes(editor, paragraphs);
            {/*if (text.includes("\n")) {
              event.preventDefault();
              const codeBlock = {
                type: "code",
                language: "javascript",
                children: [{ text }],
              };
              Transforms.insertNodes(editor, codeBlock);
            }*/}
          }}
          className="overflow-hidden border p-3 rounded"
        />
      </Slate>
    </div>
  );
}

// --- Toggle block yang sudah direvisi untuk block code ---
  const toggleBlock = (editor, format) => {
    const isAlign = TEXT_ALIGN_TYPES.includes(format);
    const isActive = isBlockActive(
      editor,
      format,
      isAlign ? "align" : "type"
    );
    const isList = LIST_TYPES.includes(format);

    if (format === "code") {
      // Toggle khusus block code dengan gabungkan teks
      toggleCodeBlock(editor);
      return;
    }

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
      Transforms.setNodes(editor, { type: "list-item" });

      // Then wrap the list-item in the correct list type (ul/ol)
      const list = { type: format, children: [] };
      Transforms.wrapNodes(editor, list, {
        match: (n) =>
          SlateElement.isElement(n) && n.type === "list-item",
      });
    }
  };

  // --- Fungsi toggle khusus untuk block code ---
  const toggleCodeBlock = (editor) => {
    if (!editor.selection) return;

    // Cek apakah selection sudah di dalam block code
    const [match] = Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "code",
    });

    if (match) {
      // Jika sudah di code block, toggle ke paragraf biasa
      Transforms.setNodes(editor, { type: "paragraph" });
      return;
    }

    if (Range.isCollapsed(editor.selection)) {
      // Jika gak ada selection, insert block code kosong
      const codeBlock = {
        type: "code",
        language: "javascript",
        children: [{ text: "" }],
      };
      Transforms.insertNodes(editor, codeBlock);
      return;
    }

    // Ambil seluruh fragment dari selection
    const fragment = Editor.fragment(editor, editor.selection);

    // Gabungkan semua teks fragment jadi satu string, dengan \n antar paragraf
    let text = fragment
      .map((node) => Node.string(node))
      .join("\n");

    // Ganti semua <br> menjadi \n (kalau ada)
    text = text.replace(/<br\s*\/?>/gi, "\n");

    // Buat block code baru dengan text tadi
    const codeBlock = {
      type: "code",
      language: "javascript",
      children: [{ text }],
    };

    // Hapus isi selection dulu
    Transforms.delete(editor, { at: editor.selection });

    // Insert code block di tempat awal selection
    Transforms.insertNodes(editor, codeBlock, {
      at: editor.selection.anchor.path.slice(0, -1),
    });

    // Pindahkan cursor ke akhir code block
    Transforms.select(editor, Editor.end(editor, []));
  };

// --- Helper toggle marks ---
const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) Editor.removeMark(editor, format);
  else Editor.addMark(editor, format, true);
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
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

// --- Normalisasi node kosong ---
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

// --- Toolbar & Buttons ---
const Toolbar = ({ children }) => (
  <div
    style={{
      borderBottom: "1px solid #ccc",
      marginBottom: "1rem",
      paddingBottom: "0.5rem",
      display: "flex",
      gap: "0.5rem",
      flexWrap: "wrap",
    }}
  >
    {children}
  </div>
);

const Button = ({ active, onMouseDown, children }) => (
  <button
    style={{
      backgroundColor: active ? "#3182ce" : "#e2e8f0",
      border: "none",
      padding: "0.5rem 0.7rem",
      cursor: "pointer",
      fontWeight: active ? "bold" : "normal",
      borderRadius: "4px",
      userSelect: "none",
    }}
    onMouseDown={(e) => {
      e.preventDefault();
      onMouseDown();
    }}
    type="button"
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

const ImageButton = ({format}) => {
  const editor = useSlate()
  const handleInsertImage = () => {
    const url = window.prompt("Masukkan URL gambar:");
    if (url) {
     const image = {
        type: "image-util",
        url,
        children: [{text:""}],
      };
      Transforms.insertNodes(editor, image);
    } else {
      alert("URL tidak valid. Harap masukkan URL gambar yang benar.");
    }
  };
  return(
    <Button active={isMarkActive(editor,format)} 
    onMouseDown={handleInsertImage}
    >
      <FaImages />
    </Button>
  )
}

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

// --- Render Element ---
const Element = ({ attributes, children, element }) => {
  const baseStyle = styleMap[element.type] || {};
  const alignStyle = element.align ? styleMap.align[element.align] : {};
  const combinedStyle = { ...baseStyle, ...alignStyle };
  const editor = useSlate();


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
      return (
        <h1 style={combinedStyle} {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 style={combinedStyle} {...attributes}>
          {children}
        </h2>
      );
    case "numbered-list":
      return (
        <ol className="list-decimal"  style={combinedStyle} {...attributes}>
          {children}
        </ol>
      );
    case "bulleted-list":
      return (
        <ul className="list-disc" style={combinedStyle} {...attributes}>
          {children}
        </ul>
      );
    case "list-item":
      return (
        <li style={combinedStyle} {...attributes}>
          {children}
        </li>
      );
    case "image-util":
      return (
        <div
          contentEditable={false}
          className="relative flex justify-center items-center my-4"
        >
          <img
            src={element.url}
            alt="Uploaded"
            className="w-full lg:h-[400px] object-contain"
          />
          {/* Tombol hapus yang posisinya absolute di tengah gambar */}
          <button
            type="button"
            onClick={() => {
              // Cari path gambar ini di editor
              const path = ReactEditor.findPath(editor, element);
              // Hapus node gambar berdasarkan path tersebut
              Transforms.removeNodes(editor, { at: path });
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
              bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center 
              hover:bg-red-700 z-10"
          >
            ✕
          </button>
          {children}
        </div>
      )
    case "code": {
      const codeText = Node.string(element);
      const highlightedCode = hljs.highlightAuto(codeText).value;
      return (
        <pre
          style={{
            ...combinedStyle,
            backgroundColor: "#282c34",
            color: "white",
            padding: "10px",
            borderRadius: "6px",
            overflowX: "auto",
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
          {...attributes}
        >
          <code
            dangerouslySetInnerHTML={{
              __html: highlightedCode,
            }}
          />
        </pre>
      );
    }
    default:
      return (
        <div className="font-serif text-lg" >
        <p className="text-justify" {...attributes}>
          {children}
        </p>
        </div>
      );
  }
};
// --- Render Leaf (text formatting) ---
const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.code) {
    children = (
      <code
        style={{
          backgroundColor: "#eee",
          padding: "2px 4px",
          borderRadius: "4px",
          fontFamily: "monospace",
        }}
      >
        {children}
      </code>
    );
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};
