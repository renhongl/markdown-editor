import * as React from "react";
import CodeMirror from "codemirror";
import Input from "@material-ui/core/Input";
import IconButton from "@material-ui/core/IconButton";

export default class Markdown extends React.Component {
  componentDidMount() {
    const { value, handleValueChange } = this.props;
    this.myCodeMirror = CodeMirror(document.querySelector(".markdown"), {
      value: value,
      mode: { name: "markdown", highlightFormatting: true },
      lineNumbers: true
    });
    this.myCodeMirror.on("change", (a, b) => {
      handleValueChange(this.myCodeMirror.getValue());
    });
  }

  render() {
    const { title, updateTitle, openFullScreen } = this.props;
    return (
      <div className="markdown-container">
        <div className="markdown-title">
          <Input value={title} onChange={updateTitle} />
          <IconButton
            className="full-screen-btn"
            aria-label="Delete"
            onClick={openFullScreen}
          >
            <i className="material-icons">fullscreen</i>
          </IconButton>
        </div>
        <div className="markdown" />
      </div>
    );
  }
}
