import hljs from "highlight.js";
import javascript from 'highlight.js/lib/languages/javascript';
import php from 'highlight.js/lib/languages/php';
import java from 'highlight.js/lib/languages/java';
import python from 'highlight.js/lib/languages/python';
import "highlight.js/styles/atom-one-dark.css";
import { renderToStaticMarkup } from 'react-dom/server';
import { FaPaste   } from "react-icons/fa"

// Register languages
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('java', java);
hljs.registerLanguage('php', php);

// Escape HTML for safe insertion
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function serialize(nodes) {
  return nodes.map(serializeNode).join('');
}

function serializeNode(node) {
  if (typeof node.text === 'string') {
    let text = escapeHtml(node.text); // Escape raw text
    if (node.bold) text = `<strong>${text}</strong>`;
    if (node.italic) text = `<em>${text}</em>`;
    if (node.underline) text = `<u>${text}</u>`;
    return text;
  }

  const children = node.children.map(serializeNode).join('');
  const alignAttr = node.align ? ` style="text-align:${node.align};"` : '';

  switch (node.type) {
    case 'paragraph':
      return `<div class="font-serif text-lg mt-8" ><p${alignAttr} class="text-justify">${children}</p></div>`;
    case 'heading-one':
      return `<h1${alignAttr}>${children}</h1></br>`;
    case 'heading-two':
      return `<h2${alignAttr}>${children}</h2></br>`;
    case 'block-quote':
      return `<blockquote${alignAttr} class="bg-white text-black p-4 italic font-bold border-l-4 border-indigo-500">${children}</blockquote></br>`;
    case 'numbered-list':
      return `<div class="mx-15"><ol class="list-decimal" ${alignAttr}>${children}</ol></div></br>`;
    case 'bulleted-list':
      return `<div class="mx-15"><ul class="list-disc" ${alignAttr}>${children}</ul></div></br>`;
    case 'list-item':
      return `<li${alignAttr}>${children}</li>`;
    case 'image-util':
      return `
      <div
          class="relative flex justify-center items-center my-4"
        >
          <img
            src="${node.url}"
            alt="Uploaded"
            class="w-full lg:h-[400px] object-contain"
          />
      </div></br>
      `
    case 'code':
      const codeText = children;
      const highlightedCode = hljs.highlightAuto(codeText).value;
      const pasteIcon = renderToStaticMarkup(<FaPaste />);
      return `<pre${alignAttr} class="text-white relative">      
      <code class="hljs">${highlightedCode}</code></pre></br>`;
    default:
      return children;
  }
}

// Deserialize HTML string to Slate JSON
function deserialize(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  function decodeHtml(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }
  function deserializeElement(el) {
    if (el.nodeType === 3) {
      return [{ text: el.textContent }];
    }

    if (el.nodeType !== 1) {
      return [];
    }

    const nodeName = el.nodeName;
    const children = Array.from(el.childNodes).flatMap(deserializeElement);

    const style = el.getAttribute('style') || '';
    const alignMatch = style.match(/text-align:\s*(\w+)/);
    const align = alignMatch ? alignMatch[1] : undefined;

    switch (nodeName) {
      case 'P':
        return [{ type: 'paragraph', align, children }];
      case 'H1':
        return [{ type: 'heading-one', align, children }];
      case 'H2':
        return [{ type: 'heading-two', align, children }];
      case 'BLOCKQUOTE':
        return [{ type: 'block-quote', align, children }];
      case 'OL':
        return [{ type: 'numbered-list', align, children }];
      case 'UL':
        return [{ type: 'bulleted-list', align, children }];
      case 'LI':
        return [{ type: 'list-item', align, children }];
      case 'PRE':
        const code = el.querySelector('code');
        const lang = code ? code.getAttribute('data-language') : '';
        const codeText = code ? decodeHtml(code.textContent) : '';
        return [{
          type: 'code',
          language: lang || 'javascript',
          children: [{ text: codeText }]
        }];
      case 'STRONG':
        return children.map(child => ({ ...child, bold: true }));
      case 'EM':
        return children.map(child => ({ ...child, italic: true }));
      case 'U':
        return children.map(child => ({ ...child, underline: true }));
      case 'BR':
        return [{ text: '\n' }];
      default:
        return children;
    }
  }

  // Helper to ensure every node has at least one text child
  function ensureTextNodes(nodes) {
    return nodes.map(node => {
      if (node.children) {
        const fixedChildren = ensureTextNodes(node.children);
        if (fixedChildren.length === 0) {
          return { ...node, children: [{ text: '' }] };
        }
        return { ...node, children: fixedChildren };
      }
      return node;
    });
  }

  const rawNodes = Array.from(doc.body.childNodes).flatMap(deserializeElement);
  return ensureTextNodes(rawNodes);
}


export { serialize, deserialize };
