import * as React from "react";
import * as Showdown from "showdown";
import Preview from "./Preview";
import "draft-js/dist/Draft.css";
import "./style.css";
import Drawer from "./Drawer";
import AppBar from "./AppBar";
import Markdown from "./Markdown";
import html2pdf from "html2pdf.js";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import AlertDialog from "./Dialog";
import { defaultText } from "./config";
import "./theme.css";

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

let settingStr = window.localStorage.getItem("pomeloSettings");
let settingObj = settingStr ? JSON.parse(settingStr) : {};

let defaultPrimary = settingObj.primary || "#555555";
let defaultSecondary = settingObj.secondary || "#d32f2f";
let defaultAutoSave = settingObj.autoSave || false;

const th = createMuiTheme({
  palette: {
    primary: { main: defaultPrimary },
    secondary: { main: defaultSecondary }
  },
  typography: { useNextVariants: true }
});

export default class MarkdownEditor extends React.Component {
  state = {
    theme: null,
    primary: defaultPrimary,
    secondary: defaultSecondary,
    autoSave: defaultAutoSave
  };

  constructor(props) {
    super(props);
    let historyList = window.localStorage.getItem("pomeloMd");
    if (historyList) {
      historyList = JSON.parse(historyList);
    } else {
      historyList = null;
    }
    this.state = {
      current: 0,
      left: false,
      fileList: historyList || [
        {
          id: Math.random(),
          title: "Utitled Document.md",
          text: defaultText
        }
      ],
      snackOpen: false,
      snackMsg: "",
      openDialog: false,
      openId: null
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
    if (this.state.autoSave) {
      this.autoSaveDoc();
    }
  }

  autoSaveDoc() {
    if (this.saveTimer) {
      clearInterval(this.saveTimer);
    }
    this.saveTimer = setInterval(() => {
      this.saveDoc();
    }, 30000);
  }

  updateTheme() {
    const theme = createMuiTheme({
      palette: {
        primary: { main: this.state.primary || defaultPrimary },
        secondary: { main: this.state.secondary || defaultSecondary }
      },
      typography: { useNextVariants: true }
    });
    this.setState({
      theme
    });
  }

  saveToLocalStorage(key, value) {
    let settingStr = window.localStorage.getItem("pomeloSettings");
    let settingObj = settingStr ? JSON.parse(settingStr) : {};
    settingObj[key] = value;
    window.localStorage.setItem("pomeloSettings", JSON.stringify(settingObj));
  }

  handleSettingChange = (key, value, type) => {
    this.setState(
      {
        [key]: value
      },
      () => {
        if (type !== "settings") {
          this.updateTheme();
        }
        this.saveToLocalStorage(key, value);
        if (key === "autoSave" && value) {
          this.autoSaveDoc();
        }
        if (key === "autoSave" && !value) {
          clearInterval(this.saveTimer);
        }
      }
    );
  };

  toggleDrawer = () => {
    this.setState({
      left: !this.state.left
    });
  };

  previewPdf = () => {
    const { fileList, current } = this.state;
    let element = document.getElementById("content");
    let opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: fileList[current].title.replace(".md", ""),
      image: { type: "jpeg", quality: 0.98 },
      pagebreak: { mode: ["avoid-all"] },
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
      .toPdf()
      .get("pdf")
      .then(function(pdf) {
        window.open(pdf.output("bloburl"), "_blank");
      });
  };

  exportPdf = () => {
    const { fileList, current } = this.state;
    let element = document.getElementById("content");
    let opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: fileList[current].title.replace(".md", ""),
      image: { type: "jpeg", quality: 0.98 },
      pagebreak: { mode: ["avoid-all"] },
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

  previewHtml = () => {
    const { fileList, current } = this.state;
    let previewHtml = document.querySelector(".preview");
    let win = window.open();
    win.document.open();
    let content = `<title>${fileList[current].title.replace(
      /.md/gi,
      ".html"
    )}</title>${previewHtml.innerHTML}`;
    win.document.write(content);
  };

  previewMD = () => {
    const { fileList, current } = this.state;
    let win = window.open();
    win.document.open();
    let content = `<title>${fileList[current].title.replace(
      /.md/gi,
      ".md"
    )}</title>${fileList[current].text
      .replace(/\n|\r/gi, "<br/>")
      .replace(/\t|\s/gi, "&nbsp;")}`;
    win.document.write(content);
  };

  exportHtml = () => {
    const { fileList, current } = this.state;
    let previewHtml = document.querySelector(".preview");
    this.download(
      fileList[current].title.replace(".md", ".html"),
      previewHtml.innerHTML
    );
  };

  exportMD = () => {
    const { fileList, current } = this.state;
    this.download(fileList[current].title, fileList[current].text);
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

  deleteAction = id => {
    this.setState({
      openDialog: true,
      openId: id
    });
  };

  addDocment = (e, name = "Utitled Document.md", text = defaultText) => {
    this.setState({
      fileList: [
        ...this.state.fileList,
        {
          id: Math.random(),
          title: name,
          text: text
        }
      ]
    });
  };

  saveDoc = () => {
    let cache = JSON.stringify(this.state.fileList);
    window.localStorage.setItem("pomeloMd", cache);
    this.showMessage("Save Documents Successfully.");
  };

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

  closeSnack = () => {
    this.setState({
      snackOpen: false
    });
  };

  toggleDialog = confirmed => {
    this.setState({
      openDialog: !this.state.openDialog
    });
    if (confirmed) {
      let newList = [...this.state.fileList];
      newList = newList.filter(item => item.id !== this.state.openId);
      if (newList.length === 0) {
        newList = [
          {
            id: Math.random(),
            title: "Utitled Document.md",
            text: defaultText
          }
        ];
      }
      this.setState(
        {
          fileList: newList,
          current: 0
        },
        () => {
          this.switchCurrent(0);
        }
      );
    }
  };

  showMessage = msg => {
    this.setState(
      {
        snackMsg: msg
      },
      () => {
        this.setState({
          snackOpen: true
        });
      }
    );
  };

  openFullScreen = () => {
    let elem = document.querySelector(".markdown");
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };

  importMD = e => {
    let file = e.target.files[0];
    if (!file) {
      return;
    }
    let reader = new FileReader();
    reader.onload = e => {
      let contents = e.target.result;
      this.addDocment(null, file.name, contents);
      this.switchCurrent(this.state.fileList.length - 1);
    };
    reader.readAsText(file);
  };

  render() {
    const {
      fileList,
      left,
      current,
      snackOpen,
      snackMsg,
      openDialog,
      openId,
      theme,
      primary,
      autoSave
    } = this.state;
    let deleteId = 0;
    fileList.forEach((item, index) => {
      if (item.id === openId) {
        deleteId = index;
      }
    });
    const DialogContent = () => {
      return (
        <div>
          {fileList[deleteId].title}
          <br />
          Words Count: {fileList[deleteId].text.split(" ").length}
        </div>
      );
    };
    return (
      <MuiThemeProvider theme={theme || th}>
        <div style={styles.container}>
          <AlertDialog
            title="Are you sure you want to delete this document?"
            content={<DialogContent />}
            open={openDialog}
            toggleDialog={this.toggleDialog}
          />
          <AppBar
            toggleDrawer={this.toggleDrawer}
            exportMD={this.exportMD}
            exportPdf={this.exportPdf}
            exportHtml={this.exportHtml}
            previewHtml={this.previewHtml}
            previewPdf={this.previewPdf}
            previewMD={this.previewMD}
            importMD={this.importMD}
            handleSettingChange={this.handleSettingChange}
            primaryColor={primary || defaultPrimary}
            autoSave={autoSave === undefined ? defaultAutoSave : autoSave}
          />
          <Drawer
            open={left}
            toggleDrawer={this.toggleDrawer}
            fileList={fileList}
            switchCurrent={this.switchCurrent}
            addDocment={this.addDocment}
            deleteAction={this.deleteAction}
            saveDoc={this.saveDoc}
            current={current}
          />
          <div style={styles.left}>
            {current !== -1 ? (
              <Markdown
                title={fileList[current].title}
                handleValueChange={this.handleValueChange}
                value={fileList[current].text}
                current={current}
                updateTitle={this.updateTitle}
                openFullScreen={this.openFullScreen}
              />
            ) : null}
          </div>
          <div style={styles.right}>
            {current !== -1 ? <Preview input={fileList[current].text} /> : null}
          </div>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left"
            }}
            open={snackOpen}
            autoHideDuration={6000}
            onClose={this.closeSnack}
            message={<span id="message-id">{snackMsg}</span>}
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                onClick={this.closeSnack}
              >
                <CloseIcon />
              </IconButton>
            ]}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}
