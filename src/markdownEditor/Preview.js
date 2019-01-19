import React from "react";
import hljs from "highlight.js";
import MarkdownIt from "markdown-it";
import "highlight.js/styles/atom-one-light.css";

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs"><code>' +
          hljs.highlight(lang, str, true).value +
          "</code></pre>"
        );
      } catch (__) {}
    }
    return (
      '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + "</code></pre>"
    );
  }
});

export default class Preview extends React.Component {
  render() {
    const { input } = this.props;
    const result = md.render(input);
    return (
      <div className="preview-container">
        <div className="preview-title">
          <div className="preview-title-left">Preview</div>
        </div>
        <div className="preview">
          <div id="content" dangerouslySetInnerHTML={{ __html: result }} />
        </div>
      </div>
    );
  }
}
