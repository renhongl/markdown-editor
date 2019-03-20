import * as React from "react";
import * as Showdown from "showdown";
import Preview from "./Preview";
import "draft-js/dist/Draft.css";
import "./style.css";
import Drawer from "./Drawer";
import AppBar from "./AppBar";
import Markdown from "./Markdown";
import html2pdf from "html2pdf.js";

const styles = {
  container: {
    width: "100%",
    height: "100%"
  },
  left: {
    width: "50%",
    float: "left",
    height: "calc(100% - 66px)"
  },
  right: {
    width: "50%",
    float: "left",
    height: "calc(100% - 66px)",
    overflow: "hidden"
  }
};

export default class MarkdownEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      left: false,
      fileList: [
        {
          id: 0,
          title: "Utitled Document.md",
          text: "Welcome to use my markdown editor."
        }
      ]
    };
    this.converter = new Showdown.Converter({
      tables: true,
      simplifiedAutoLink: true
    });
  }

  handleValueChange = value => {
    this.updateFileListText(value);
  };

  updateFileListText(value) {
    let newFileList = JSON.parse(JSON.stringify(this.state.fileList));
    newFileList.forEach((item, i) => {
      if (i === this.state.current) {
        item.text = value;
      }
    });
    this.setState({
      fileList: newFileList
    });
  }

  componentDidMount() {
    setTimeout(() => {
      this.handleEvents();
    }, 700);
  }

  toggleDrawer = () => {
    this.setState({
      left: !this.state.left
    });
  };

  exportPdf = () => {
    const { fileList, current } = this.state;
    let element = document.getElementById("content");
    let opt = {
      margin: 1,
      filename: fileList[current].title.replace(".md", ""),
      image: { type: "jpeg", quality: 0.98 },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      html2canvas: {
        dpi: 192,
        letterRendering: true,
        useCORS: true,
        imageTimeout: 0
      },
      useCORS: true,
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
    };
    html2pdf()
      .set(opt)
      .from(element)
      .save();
  };

  exportMD = () => {
    const { fileList, current } = this.state;
    const content = document.querySelector(".CodeMirror-lines").innerText;
    this.download(fileList[current].title, content);
  };

  download(filename, text) {
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  getFileObj(id) {
    return this.state.fileList.filter(item => item.id === id)[0];
  }

  switchCurrent = id => {
    this.setState({
      current: -1
    });
    setTimeout(() => {
      this.setState({
        current: id
      });
    }, 500);
    setTimeout(() => {
      this.handleEvents();
    }, 700);
  };

  handleEvents() {
    let preview = document.querySelector(".preview");
    let md = document.querySelector(".CodeMirror-scroll");
    let scroolDom = -1;
    let timer = null;
    const reset = () => {
      if (timer !== null) {
        clearTimeout(timer);
      }
      timer = setTimeout(function() {
        scroolDom = -1;
      }, 20);
    };
    md.addEventListener("scroll", e => {
      if (scroolDom === -1) {
        scroolDom = 0;
        let scrollScale =
          e.target.scrollTop / (e.target.scrollHeight - e.target.clientHeight);
        preview.scrollTop =
          (preview.scrollHeight - preview.clientHeight) * scrollScale;
        reset();
      }
    });

    preview.addEventListener("scroll", e => {
      if (scroolDom === -1) {
        scroolDom = 1;
        let scrollScale =
          e.target.scrollTop / (e.target.scrollHeight - e.target.clientHeight);
        md.scrollTop = (md.scrollHeight - md.clientHeight) * scrollScale;
        reset();
      }
    });
  }

  updateTitle = e => {
    this.updateFileListTitle(e.target.value);
  };

  updateFileListTitle(value) {
    let newFileList = JSON.parse(JSON.stringify(this.state.fileList));
    newFileList.forEach((item, i) => {
      if (i === this.state.current) {
        item.title = value;
      }
    });
    this.setState({
      fileList: newFileList
    });
  }

  render() {
    const { fileList, left, current } = this.state;
    return (
      <div style={styles.container}>
        <AppBar
          toggleDrawer={this.toggleDrawer}
          exportMD={this.exportMD}
          exportPdf={this.exportPdf}
        />
        <Drawer
          open={left}
          toggleDrawer={this.toggleDrawer}
          fileList={fileList}
          switchCurrent={this.switchCurrent}
        />
        <div style={styles.left}>
          {current !== -1 ? (
            <Markdown
              title={fileList[current].title}
              handleValueChange={this.handleValueChange}
              value={fileList[current].text}
              current={current}
              updateTitle={this.updateTitle}
            />
          ) : null}
        </div>
        <div style={styles.right}>
          {current !== -1 ? <Preview input={fileList[current].text} /> : null}
        </div>
      </div>
    );
  }
}
