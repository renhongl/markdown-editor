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
import { defaultText, defaultChineseText } from "./config";
import { I18n } from "react-i18nify";
import en from "../lang/en.json";
import zh from "../lang/zh.json";
import "./theme.css";

const styles = {
  container: {
    width: "100%",
    height: "100%"
  },
  fullContainer: {
    width: "100%",
    height: "calc(100% - 64px)",
    overflow: "hidden"
  },
  left: {
    width: "50%",
    float: "left",
    height: "100%",
    overflow: "hidden"
  },
  right: {
    width: "50%",
    float: "left",
    height: "100%",
    overflow: "hidden"
  }
};

let settingStr = window.localStorage.getItem("pomeloSettings");
let settingObj = settingStr ? JSON.parse(settingStr) : {};

let defaultPrimary = settingObj.primary || "#555555";
let defaultSecondary = settingObj.secondary || "#d32f2f";
let defaultAutoSave = settingObj.autoSave || false;
let defaultLang = settingObj.lang || "en";

I18n.setTranslations({
  en,
  zh
});

I18n.setLocale(defaultLang);

const th = createMuiTheme({
  palette: {
    primary: { main: defaultPrimary },
    secondary: { main: defaultSecondary }
  },
  typography: { useNextVariants: true }
});

const getDefaultText = () => {
  let settingStr = window.localStorage.getItem("pomeloSettings");
  let settingObj = settingStr ? JSON.parse(settingStr) : {};
  if (settingObj.lang === "en") {
    return defaultText;
  }
  return defaultChineseText;
};

export default class MarkdownEditor extends React.Component {
  state = {
    theme: null,
    primary: defaultPrimary,
    secondary: defaultSecondary,
    autoSave: defaultAutoSave,
    lang: defaultLang,
    fullScreen: false
  };

  constructor(props) {
    super(props);
    let historyList = window.localStorage.getItem("pomeloMd");
    if (historyList && JSON.parse(historyList).length !== 0) {
      historyList = JSON.parse(historyList);
      historyList[0].open = true;
    } else {
      historyList = [
        {
          id: Math.random(),
          title: `${I18n.t("untitled document")}-1.md`,
          text: getDefaultText(),
          save: true,
          open: true
        }
      ];
    }
    this.state = {
      current: 0,
      left: false,
      fileList: historyList,
      snackOpen: false,
      snackMsg: "",
      openDialog: false,
      openId: null
    };
    this.converter = new Showdown.Converter({
      tables: true,
      simplifiedAutoLink: true
    });
    this.saveCurrentDoc();
  }

  getIndex(list) {
    if (list instanceof Array && list.length === 0) {
      return 1;
    }
    let currentIndex =
      list ||
      this.state.fileList.map(item => {
        return item.title.split(/-|\./g)[1];
      });
    currentIndex = currentIndex.filter(item => !Number.isNaN(Number(item)));
    if (currentIndex.length === 0) {
      return 1;
    }
    let max = Math.max.apply(null, currentIndex) || 0;
    return max + 1;
  }

  handleValueChange = value => {
    this.updateFileListText(value);
  };

  updateFileListText(value) {
    let newFileList = JSON.parse(JSON.stringify(this.state.fileList));
    newFileList.forEach((item, i) => {
      if (i === this.state.current) {
        item.text = value;
        item.save = false;
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
    this.addKeDownEvent();
    this.getToken();
  }

  getToken() {
    let code = this.getUrlVars("code", "");
    fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client_id: "a3be5a8e9cc8df9b2254",
        client_secret: "ec284f3c399ea3896c4e8708da20d25e6b844b0c",
        code: code
      })
    }).then(res => {
      res.json().then(json => {
        console.log("auth: " + json);
      });
    });
  }

  getUrlVars() {
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(
      m,
      key,
      value
    ) {
      vars[key] = value;
    });
    return vars;
  }

  addKeDownEvent = () => {
    document.querySelector(".markdown").addEventListener("keydown", e => {
      if (e.ctrlKey && e.which === 83) {
        this.saveCurrentDoc();
        e.preventDefault();
      }
    });
  };

  saveCurrentDoc() {
    let saved = false;
    let currentIndex = this.state.current;
    let currentDoc = this.state.fileList.filter(
      (item, inde) => currentIndex === inde
    );
    let currentSaveStr = window.localStorage.getItem("pomeloMd");
    let currentSaveArr = currentSaveStr ? JSON.parse(currentSaveStr) : [];

    currentSaveArr.forEach(item => {
      if (item.id === currentDoc[0].id) {
        item.text = currentDoc[0].text;
        item.save = true;
        saved = true;
      }
    });
    if (!saved) {
      currentDoc[0].save = true;
      currentSaveArr.push(currentDoc[0]);
    }
    window.localStorage.setItem("pomeloMd", JSON.stringify(currentSaveArr));
    let newFileList = JSON.parse(JSON.stringify(this.state.fileList));
    newFileList.forEach((item, i) => {
      if (i === currentIndex) {
        item.save = true;
      }
    });
    this.setState({
      fileList: newFileList
    });
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

  getPdf = callback => {
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
        callback(pdf.output("bloburl"), "aaa");
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

  switchFileById = id => {
    let indexForId = 0;
    this.state.fileList.forEach((item, index) => {
      if (item.id === id) {
        indexForId = index;
      }
    });
    this.switchCurrent(indexForId);
  };

  closeFile = id => {
    let newFileList = JSON.parse(JSON.stringify(this.state.fileList));
    newFileList.forEach((item, i) => {
      if (item.id === id) {
        item.open = false;
      }
    });
    window.localStorage.setItem("pomeloMd", JSON.stringify(newFileList));
    this.setState(
      {
        fileList: newFileList
      },
      () => {
        this.switchCurrent(-1);
        let switched = false;
        newFileList.forEach((item, index) => {
          if (item.open && !switched) {
            this.switchCurrent(index);
            switched = true;
          }
        });
      }
    );
  };

  openFile = index => {
    let openId = 0;
    let newFileList = JSON.parse(JSON.stringify(this.state.fileList));
    newFileList.forEach((item, i) => {
      if (i === index) {
        item.open = true;
        openId = item.id;
      }
    });
    this.setState({
      fileList: newFileList
    });
    let currentSaveStr = window.localStorage.getItem("pomeloMd");
    let currentSaveArr = currentSaveStr ? JSON.parse(currentSaveStr) : [];
    currentSaveArr.forEach(item => {
      if (item.id === openId) {
        item.open = true;
      }
    });
    window.localStorage.setItem("pomeloMd", JSON.stringify(currentSaveArr));
  };

  switchCurrent = index => {
    this.setState(
      {
        current: index
      },
      () => {
        this.handleEvents();
      }
    );
  };

  handleEvents() {
    let preview = document.querySelector(".preview");
    let md = document.querySelector(".CodeMirror-scroll");
    if (!md) {
      return;
    }
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

  addDocment = (
    e,
    name = `${I18n.t("untitled document")}-${this.getIndex()}.md`,
    text = getDefaultText()
  ) => {
    this.setState(
      {
        fileList: [
          ...this.state.fileList,
          {
            id: Math.random(),
            title: name,
            text: text,
            save: true,
            open: true
          }
        ]
      },
      () => {
        let curr = this.state.fileList.length - 1;
        this.setState(
          {
            current: curr
          },
          () => {
            this.switchCurrent(curr);
            this.saveCurrentDoc();
          }
        );
      }
    );
  };

  saveDoc = () => {
    let newFileList = JSON.parse(JSON.stringify(this.state.fileList));
    newFileList.forEach(item => {
      item.save = true;
    });
    let cache = JSON.stringify(newFileList);
    window.localStorage.setItem("pomeloMd", cache);
    this.setState({
      fileList: newFileList
    });
    this.showMessage("Save Documents Successfully.");
  };

  updateTitle = (id, value) => {
    let newFileList = JSON.parse(JSON.stringify(this.state.fileList));
    newFileList.forEach((item, i) => {
      if (id === item.id) {
        item.title = value;
      }
    });
    this.setState({
      fileList: newFileList
    });
    let currentSaveStr = window.localStorage.getItem("pomeloMd");
    let currentSaveArr = currentSaveStr ? JSON.parse(currentSaveStr) : [];
    currentSaveArr.forEach(item => {
      if (item.id === id) {
        item.title = value;
      }
    });
    window.localStorage.setItem("pomeloMd", JSON.stringify(currentSaveArr));
  };

  closeSnack = () => {
    this.setState({
      snackOpen: false
    });
  };

  toggleDialog = confirmed => {
    this.setState(
      {
        openDialog: !this.state.openDialog,
        current: -1
      },
      () => {
        if (confirmed) {
          let newList = [...this.state.fileList];
          let temp = newList.filter(item => item.id === this.state.openId)[0];
          newList = newList.filter(item => item.id !== this.state.openId);
          if (newList.length === 0) {
            newList[0] = temp;
            newList[0].title = `${I18n.t("untitled document")}-${this.getIndex(
              []
            )}.md`;
            newList[0].text = getDefaultText();
            newList[0].save = true;
            newList[0].open = true;
          }
          let openIndex = 0;
          let gotIndex = false;
          this.state.fileList.forEach((item, index) => {
            if (item.open && !gotIndex) {
              openIndex = index;
              gotIndex = true;
            }
          });
          if (!gotIndex) {
            this.openFile(openIndex);
          }
          this.setState(
            {
              fileList: newList,
              current: openIndex
            },
            () => {
              this.switchCurrent(openIndex);
              this.deleteById(this.state.openId);
            }
          );
        }
      }
    );
  };

  deleteById(id) {
    let currentSaveStr = window.localStorage.getItem("pomeloMd");
    let currentSaveArr = currentSaveStr ? JSON.parse(currentSaveStr) : [];
    let newFiles = currentSaveArr.filter(item => item.id !== id);
    window.localStorage.setItem("pomeloMd", JSON.stringify(newFiles));
  }

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
    let elem = document.querySelector(".full-container");
    if (
      this.state.fullScreen === undefined ||
      this.state.fullScreen === false
    ) {
      console.log("full");
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
      this.setState({
        fullScreen: true
      });
    } else {
      console.log("exit");
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      this.setState({
        fullScreen: false
      });
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
      autoSave,
      lang,
      fullScreen
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
          Words Count:{" "}
          {
            fileList[deleteId].text
              .split(/\s|\t|\n/gi)
              .filter(item => item.trim() !== "").length
          }
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
            lang={lang || defaultLang}
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
            updateTitle={this.updateTitle}
            openFile={this.openFile}
          />
          <div className="full-container" style={styles.fullContainer}>
            <div className="app-left" style={styles.left}>
              {current !== -1 ? (
                <Markdown
                  title={fileList[current].title}
                  save={fileList[current].save}
                  fileList={fileList}
                  handleValueChange={this.handleValueChange}
                  value={fileList[current].text}
                  current={current}
                  openFullScreen={this.openFullScreen}
                  switchFileById={this.switchFileById}
                  closeFile={this.closeFile}
                  currentId={fileList[current].id}
                  addKeDownEvent={this.addKeDownEvent}
                  fullScreen={fullScreen}
                />
              ) : null}
            </div>
            <div className="app-right" style={styles.right}>
              {current !== -1 ? (
                <Preview input={fileList[current].text} getPdf={this.getPdf} />
              ) : null}
            </div>
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
