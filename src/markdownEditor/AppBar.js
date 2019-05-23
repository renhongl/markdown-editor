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
    anchorEl: null
  };

  handleChange = event => {
    this.setState({ auth: event.target.checked });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = type => {
    this.setState({ anchorEl: null });
    if (type && type === "pdf") {
      this.props.exportPdf();
    }
    if (type && type === "md") {
      this.props.exportMD();
    }
  };

  goToGithub = () => {
    window.location = "https://github.com/renhongl/markdown-editor";
  };

  render() {
    const { classes, toggleDrawer } = this.props;
    const { auth, anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div className={classes.root}>
        <AppBar position="static">
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
              Pomelo Editor --- One markdown editor implement by react
            </Typography>
            {auth && (
              <div>
                <Button
                  aria-owns={open ? "menu-appbar" : undefined}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                >
                  export as <i class="material-icons">arrow_drop_down</i>
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
