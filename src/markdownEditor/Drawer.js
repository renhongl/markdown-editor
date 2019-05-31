import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import ExtendPanel from "./ExtendPanel";
import Button from "@material-ui/core/Button";
import { I18n } from "react-i18nify";

const styles = {
  list: {
    width: 250
  },
  title: {
    paddingLeft: "20px"
  },
  button: {
    display: "block",
    width: "90%",
    margin: "10px auto"
  }
};

class TemporaryDrawer extends React.Component {
  render() {
    const {
      classes,
      open,
      toggleDrawer,
      fileList,
      switchCurrent,
      addDocment,
      deleteAction,
      saveDoc,
      current,
      openFile,
      updateTitle
    } = this.props;
    return (
      <div>
        <Drawer open={open} onClose={toggleDrawer}>
          <div
            tabIndex={0}
            role="button"
            className={classes.list}
            onKeyDown={toggleDrawer}
          >
            <h4 className={classes.title}>{I18n.t("title")}</h4>
            <ExtendPanel
              fileList={fileList}
              switchCurrent={switchCurrent}
              toggleDrawer={toggleDrawer}
              addDocment={addDocment}
              deleteAction={deleteAction}
              saveDoc={saveDoc}
              updateTitle={updateTitle}
              current={current}
              openFile={openFile}
            />
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={addDocment}
            >
              {I18n.t("new document")}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              className={classes.button}
              onClick={saveDoc}
            >
              {I18n.t("save session")}
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}

TemporaryDrawer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TemporaryDrawer);
