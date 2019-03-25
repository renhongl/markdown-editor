import * as React from "react";
import CodeMirror from "codemirror";
import Input from "@material-ui/core/Input";

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
    const { title, updateTitle } = this.props;
    return (
      <div className="markdown-container">
        <div className="markdown-title">
          <Input value={title} onChange={updateTitle} />
        </div>
        <div className="markdown" />
      </div>
    );
  }
}
