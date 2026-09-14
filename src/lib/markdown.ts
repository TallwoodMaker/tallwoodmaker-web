import MarkdownIt from "markdown-it";

// html: false (the default, made explicit here) means raw HTML tags in the
// markdown source are escaped as literal text rather than rendered — this
// is what makes the dangerouslySetInnerHTML use in premium/page.tsx and
// ContentForm.tsx's preview safe: the only HTML reaching the DOM is what
// markdown-it itself generates from markdown syntax, never author-supplied
// raw HTML.
const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
});

export function renderMarkdown(source: string): string {
  return md.render(source);
}
