import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Button from "@material-ui/core/Button";
import AlertDialog from "./Dialog";
import Settings from "./Settings";

import { I18n } from "react-i18nify";

const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  openIcon: {
    fontSize: "15px",
    color: "#bfbfbf",
    marginLeft: "4px"
  }
};

class MenuAppBar extends React.Component {
  state = {
    auth: true,
    anchorEl: null,
    previewAnchorEl: null,
    importAnchorEl: null,
    showSettings: false
  };

  handleImportClose = (type, e) => {
    this.setState({ importAnchorEl: null });
    if (type && type === "md") {
      this.props.importMD(e);
    }
    if (type && type === "html") {
      this.props.previewHtml();
    }
  };

  handleImport = event => {
    this.setState({ importAnchorEl: event.currentTarget });
  };

  handlePreivew = event => {
    this.setState({ previewAnchorEl: event.currentTarget });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handlePreviewClose = type => {
    this.setState({ previewAnchorEl: null });
    if (type && type === "pdf") {
      this.props.previewPdf();
    }
    if (type && type === "md") {
      this.props.previewMD();
    }
    if (type && type === "html") {
      this.props.previewHtml();
    }
  };

  handleClose = type => {
    this.setState({ anchorEl: null });
    if (type && type === "pdf") {
      this.props.exportPdf();
    }
    if (type && type === "md") {
      this.props.exportMD();
    }
    if (type && type === "html") {
      this.props.exportHtml();
    }
  };

  goToGithub = () => {
    window.location = "https://github.com/renhongl/markdown-editor";
  };

  toggleSetting = () => {
    this.setState({
      showSettings: !this.state.showSettings
    });
  };

  loginGit = () => {
    window.location =
      "https://github.com/login/oauth/authorize?client_id=a3be5a8e9cc8df9b2254";
  };

  render() {
    const {
      classes,
      toggleDrawer,
      handleSettingChange,
      primaryColor,
      autoSave,
      lang
    } = this.props;
    const {
      auth,
      anchorEl,
      previewAnchorEl,
      importAnchorEl,
      showSettings
    } = this.state;
    const open = Boolean(anchorEl);
    const preivewOpen = Boolean(previewAnchorEl);
    const importOpen = Boolean(importAnchorEl);

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <AlertDialog
            title={I18n.t("settings")}
            content={
              <Settings
                handleSettingChange={handleSettingChange}
                primaryColor={primaryColor}
                autoSave={autoSave}
                lang={lang}
              />
            }
            toggleDialog={this.toggleSetting}
            type="help"
            open={showSettings}
          />
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={toggleDrawer}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              {I18n.t("title")}
            </Typography>
            {auth && (
              <div>
                <Button
                  aria-owns={importOpen ? "import-menu" : undefined}
                  aria-haspopup="true"
                  onClick={this.handleImport}
                  color="inherit"
                >
                  {I18n.t("import from")}{" "}
                  <i className="material-icons">arrow_drop_down</i>
                </Button>
                <Menu
                  id="import-menu"
                  anchorEl={importAnchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  open={importOpen}
                  onClose={this.handleImportClose}
                >
                  {/* <MenuItem onClick={() => this.handleImportClose("html")}>
                    HTML File
                  </MenuItem> */}
                  <MenuItem>
                    <div className="import-md-btn" containerelement="label">
                      <input
                        type="file"
                        onChange={e => this.handleImportClose("md", e)}
                      />
                      MARKDOWN
                    </div>
                  </MenuItem>
                </Menu>

                <Button
                  aria-owns={preivewOpen ? "preview-menu" : undefined}
                  aria-haspopup="true"
                  onClick={this.handlePreivew}
                  color="inherit"
                >
                  {I18n.t("preview as")}{" "}
                  <i className="material-icons">arrow_drop_down</i>
                </Button>
                <Menu
                  id="preview-menu"
                  anchorEl={previewAnchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  open={preivewOpen}
                  onClose={this.handlePreviewClose}
                >
                  <MenuItem onClick={() => this.handlePreviewClose("pdf")}>
                    PDF
                  </MenuItem>
                  <MenuItem onClick={() => this.handlePreviewClose("html")}>
                    HTML
                  </MenuItem>
                  <MenuItem onClick={() => this.handlePreviewClose("md")}>
                    MARKDOWN
                  </MenuItem>
                </Menu>

                <Button
                  aria-owns={open ? "menu-appbar" : undefined}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                >
                  {I18n.t("export as")}{" "}
                  <i className="material-icons">arrow_drop_down</i>
                </Button>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  open={open}
                  onClose={this.handleClose}
                >
                  <MenuItem onClick={() => this.handleClose("pdf")}>
                    PDF
                  </MenuItem>
                  <MenuItem onClick={() => this.handleClose("html")}>
                    HTML
                  </MenuItem>
                  <MenuItem onClick={() => this.handleClose("md")}>
                    MARKDOWN
                  </MenuItem>
                </Menu>
                <Button
                  className={classes.button}
                  color="inherit"
                  onClick={this.goToGithub}
                >
                  github
                  <i className="material-icons" style={styles.openIcon}>
                    open_in_new
                  </i>
                </Button>
                <IconButton
                  className="setting-icon"
                  color="inherit"
                  aria-label="Menu"
                  onClick={this.toggleSetting}
                >
                  <i className="material-icons">settings</i>
                </IconButton>
                <IconButton
                  className="setting-icon"
                  color="inherit"
                  aria-label="Menu"
                  onClick={this.loginGit}
                >
                  <i className="material-icons">note_add</i>
                </IconButton>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MenuAppBar);
