import { marked } from "marked";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

marked.use({
  gfm: true,
  breaks: true,
});

const turndownService = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
});

turndownService.use(gfm);

turndownService.addRule("underline", {
  filter: ["u"],
  replacement: (content) => `<u>${content}</u>`,
});

const EMPTY_HTML_PATTERNS = ["", "<br>", "<div><br></div>", "<p><br></p>", "<p></p>"];

function isEditorEmpty(html: string): boolean {
  const normalized = html.trim().replace(/\s/g, "").toLowerCase();
  return EMPTY_HTML_PATTERNS.includes(normalized);
}

export function markdownToHtml(markdown: string): string {
  const trimmed = markdown.trim();
  if (!trimmed) return "";

  return marked.parse(trimmed, { async: false }) as string;
}

export function htmlToMarkdown(html: string): string {
  if (isEditorEmpty(html)) return "";

  return turndownService.turndown(html).trim();
}

export function getPlainTextFromMarkdown(markdown: string): string {
  const trimmed = markdown.trim();
  if (!trimmed) return "";

  const html = markdownToHtml(trimmed);
  const container = document.createElement("div");
  container.innerHTML = html;
  return container.textContent ?? "";
}

export function getEditorHtml(el: HTMLElement): string {
  return el.innerHTML;
}

export function setEditorContent(el: HTMLElement, markdown: string): void {
  const trimmed = markdown.trim();
  if (!trimmed) {
    el.innerHTML = "";
    return;
  }

  el.innerHTML = markdownToHtml(trimmed);
}

export function syncEditorChange(
  el: HTMLElement,
  onChange: (markdown: string) => void
): string {
  const markdown = htmlToMarkdown(getEditorHtml(el));
  onChange(markdown);
  return markdown;
}

export function focusEditor(el: HTMLElement): void {
  el.focus();
}

export function execFormat(
  el: HTMLElement,
  command: string,
  value?: string
): boolean {
  focusEditor(el);
  return document.execCommand(command, false, value);
}

export function insertHtmlAtSelection(
  el: HTMLElement,
  html: string,
  onChange: (markdown: string) => void
): string {
  focusEditor(el);
  document.execCommand("insertHTML", false, html);
  return syncEditorChange(el, onChange);
}

export function promptAndInsertLink(
  el: HTMLElement,
  onChange: (markdown: string) => void
): string {
  const url = window.prompt("Enter URL");
  if (!url?.trim()) return htmlToMarkdown(getEditorHtml(el));

  focusEditor(el);
  document.execCommand("createLink", false, url.trim());
  return syncEditorChange(el, onChange);
}

export function promptAndInsertImage(
  el: HTMLElement,
  onChange: (markdown: string) => void
): string {
  const url = window.prompt("Enter image URL");
  if (!url?.trim()) return htmlToMarkdown(getEditorHtml(el));

  const alt = window.prompt("Enter alt text") || "image";
  return insertHtmlAtSelection(
    el,
    `<img src="${url.trim()}" alt="${alt}" />`,
    onChange
  );
}

export function insertTable(
  el: HTMLElement,
  onChange: (markdown: string) => void
): string {
  const tableHtml =
    '<table><thead><tr><th>Header 1</th><th>Header 2</th></tr></thead><tbody><tr><td>Cell 1</td><td>Cell 2</td></tr></tbody></table>';
  return insertHtmlAtSelection(el, tableHtml, onChange);
}

export function insertFormula(
  el: HTMLElement,
  onChange: (markdown: string) => void
): string {
  return insertHtmlAtSelection(
    el,
    '<span class="font-serif italic">formula</span>',
    onChange
  );
}

export function applyFormatAndSync(
  el: HTMLElement,
  command: string,
  onChange: (markdown: string) => void,
  value?: string
): string {
  execFormat(el, command, value);
  return syncEditorChange(el, onChange);
}
