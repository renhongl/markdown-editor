import * as React from "react";
import CodeMirror from "codemirror";
import IconButton from "@material-ui/core/IconButton";
import activine from "codemirror-activine";
import Tooltip from "@material-ui/core/Tooltip";
import AlertDialog from "./Dialog";
import Help from "./Help";

activine(CodeMirror);

export default class Markdown extends React.Component {
  state = {
    showHelp: false
  };

  toggleHelp = () => {
    this.setState({
      showHelp: !this.state.showHelp
    });
  };

  componentDidUpdate(preProps) {
    if (preProps.current !== this.props.current) {
      this.renderMarkdown();
    }
  }

  renderMarkdown() {
    let codeDom = document.querySelector(".CodeMirror");
    if (codeDom) {
      codeDom.parentNode.removeChild(codeDom);
    }
    const { value, handleValueChange } = this.props;
    this.myCodeMirror = CodeMirror(document.querySelector(".markdown"), {
      value: value,
      mode: { name: "markdown", highlightFormatting: true },
      lineNumbers: true,
      theme: "default",
      indentUnit: 4,
      showCursorWhenSelecting: true,
      autofocus: true,
      cursorScrollMargin: 5,
      cursorHeight: 1,
      spellcheck: true,
      activeLine: true,
      autocorrect: true,
      lineWrapping: true
    });
    this.myCodeMirror.on("change", (a, b) => {
      handleValueChange(this.myCodeMirror.getValue());
    });
    this.props.addKeDownEvent();
  }

  componentDidMount() {
    this.renderMarkdown();
  }

  render() {
    const {
      openFullScreen,
      fileList,
      current,
      switchFileById,
      closeFile
    } = this.props;
    const { showHelp } = this.state;
    return (
      <div className="markdown-container">
        <AlertDialog
          title="Markdown Syntax Help"
          content={<Help />}
          open={showHelp}
          toggleDialog={this.toggleHelp}
          type="help"
        />
        <div className="markdown-title">
          <div className="title-file-list">
            {fileList
              .filter(item => item.open)
              .map((file, index) => (
                <div
                  onClick={() => switchFileById(file.id)}
                  className={
                    file.id === fileList[current].id
                      ? "title-item-wrap selected"
                      : "title-item-wrap"
                  }
                  key={file.id}
                >
                  <div className="title-item">{file.title}</div>
                  <div
                    className={
                      file.save
                        ? "title-item-status"
                        : "title-item-status unsave"
                    }
                    onClick={() => closeFile(file.id)}
                  >
                    {file.save ? "×" : <span className="unsave-icon" />}
                  </div>
                </div>
              ))}
          </div>
          <Tooltip title="Markdown Syntax" placement="bottom">
            <IconButton
              aria-label="help"
              className="help-btn"
              size="small"
              onClick={this.toggleHelp}
            >
              <i className="material-icons" fontSize="small">
                help_outline
              </i>
            </IconButton>
          </Tooltip>
          <Tooltip title="Full Screen" placement="bottom">
            <IconButton
              size="small"
              className="full-screen-btn"
              aria-label="Delete"
              onClick={openFullScreen}
            >
              <i className="material-icons" fontSize="small">
                fullscreen
              </i>
            </IconButton>
          </Tooltip>
        </div>
        <div className="markdown" />
      </div>
    );
  }
}
