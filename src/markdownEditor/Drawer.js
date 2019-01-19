import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import ExtendPanel from './ExtendPanel';

const styles = {
  list: {
    width: 250,
  },
};

class TemporaryDrawer extends React.Component {
  render() {
    const { classes, open, toggleDrawer, fileList, switchCurrent } = this.props;
    return (
      <div>
        <Drawer open={open} onClose={toggleDrawer}>
          <div
            tabIndex={0}
            role="button"
            className={classes.list}
            onKeyDown={toggleDrawer}
          >
            <h1>柚子</h1>
            <ExtendPanel fileList={fileList} switchCurrent={switchCurrent} toggleDrawer={toggleDrawer}/>
          </div>
        </Drawer>
      </div>
    );
  }
}

TemporaryDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TemporaryDrawer);