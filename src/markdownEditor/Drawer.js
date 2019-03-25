import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import ExtendPanel from "./ExtendPanel";

const styles = {
  list: {
    width: 250
  },
  title: {
    paddingLeft: "20px"
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
      deleteAction
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
            <h1 className={classes.title}>柚子</h1>
            <ExtendPanel
              fileList={fileList}
              switchCurrent={switchCurrent}
              toggleDrawer={toggleDrawer}
              addDocment={addDocment}
              deleteAction={deleteAction}
            />
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
