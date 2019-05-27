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
  componentDidMount() {
    this.addStyles();
  }

  componentDidUpdate() {
    this.addStyles();
  }

  addStyles() {
    let contentStyles = {
      fontFamily: "Source Sans Pro,Helvetica Neue,Helvetica,Arial,sans-serif",
      color: "#464646",
      fontFamily: "-webkit-body"
    };
    let tableStyles = {
      borderSpacing: 0
    };
    let thStyles = {
      height: "25px",
      background: "#fafafa",
      padding: "10px",
      borderBottom: "1px solid #e8e8e8",
      textAlign: "left",
      color: "rgba(0, 0, 0, 0.85)",
      fontWeight: 500,
      borderBottom: "1px solid #e8e8e8"
    };
    let tdStyles = {
      borderBottom: "1px solid #e8e8e8",
      height: "25px",
      padding: "10px",
      fontSize: "14px",
      // fontVariant: "tabular-nums",
      lineHeight: "1.5",
      color: "rgba(0, 0, 0, 0.65)",
      boxSizing: "border-b"
    };
    let liStyles = {
      lineHeight: "30px"
    };
    let linkStyles = {
      color: "#d32f2f",
      textDecoration: "underline"
    };
    let codeStyles = {
      lineHeight: "30px",
      background: "#ececec",
      borderRadius: "3px"
    };
    let inlineCodeStyles = {
      color: "red",
      fontFamily: "cursive",
      fontStyle: "italic"
    };
    let yinYongStyles = {
      borderLeft: "3px solid #616161",
      paddingLeft: "10px"
    };
    let content = document.getElementById("content");
    Object.keys(contentStyles).forEach(
      key => (content.style[key] = contentStyles[key])
    );
    let yinYongArr = content.querySelectorAll("blockquote p");
    for (let yinYong of yinYongArr) {
      Object.keys(yinYongStyles).forEach(
        key => (yinYong.style[key] = yinYongStyles[key])
      );
    }
    let codeArr = content.querySelectorAll("pre");
    for (let code of codeArr) {
      Object.keys(codeStyles).forEach(
        key => (code.style[key] = codeStyles[key])
      );
    }
    let inlineCodeArr = content.querySelectorAll("p code");
    for (let inlineCode of inlineCodeArr) {
      Object.keys(inlineCodeStyles).forEach(
        key => (inlineCode.style[key] = inlineCodeStyles[key])
      );
    }
    let liArr = content.querySelectorAll("li");
    for (let li of liArr) {
      Object.keys(liStyles).forEach(key => (li.style[key] = liStyles[key]));
    }
    let aArr = content.querySelectorAll("a");
    for (let a of aArr) {
      Object.keys(linkStyles).forEach(key => (a.style[key] = linkStyles[key]));
    }
    let tables = content.querySelectorAll("table");
    for (let table of tables) {
      Object.keys(tableStyles).forEach(
        key => (table.style[key] = tableStyles[key])
      );
      let thArr = table.querySelectorAll("th");
      for (let th of thArr) {
        Object.keys(thStyles).forEach(key => (th.style[key] = thStyles[key]));
      }
      let tdArr = table.querySelectorAll("td");
      for (let td of tdArr) {
        Object.keys(tdStyles).forEach(key => (td.style[key] = tdStyles[key]));
      }
    }
  }

  render() {
    const { input } = this.props;
    const result = md.render(input);
    return (
      <div className="preview-container">
        <div className="preview-title">
          <div className="preview-title-left">PREVIEW</div>
        </div>
        <div className="preview">
          <div id="content" dangerouslySetInnerHTML={{ __html: result }} />
        </div>
      </div>
    );
  }
}
