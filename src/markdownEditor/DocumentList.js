import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  listItem: {
    marginTop: "10px"
  },
  button: {
    marginLeft: 10
  }
});

class CheckboxList extends React.Component {
  state = {
    checked: [0]
  };

  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked
    });
  };

  handleAction = index => () => {
    this.props.toggleDrawer();
    this.props.switchCurrent(index);
  };

  render() {
    const { classes, fileList, addDocment, deleteAction, saveDoc } = this.props;
    return (
      <List className={classes.root}>
        {fileList.map((item, index) => (
          <ListItem
            key={item.id}
            className={classes.listItem}
            dense
            button
            onClick={this.handleToggle()}
          >
            <ListItemText primary={item.title} />
            <ListItemSecondaryAction>
              <IconButton onClick={this.handleAction(index)}>
                <i className="material-icons">border_color</i>
              </IconButton>
              <IconButton onClick={() => deleteAction(item.id)}>
                <i className="material-icons">delete</i>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
        <ListItem id="new-doc" dense button>
          <Button
            variant="outlined"
            color="primary"
            className={classes.button}
            onClick={addDocment}
          >
            New
          </Button>
          <Button
            variant="outlined"
            color="primary"
            className={classes.button}
            onClick={saveDoc}
          >
            save
          </Button>
        </ListItem>
      </List>
    );
  }
}

CheckboxList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CheckboxList);
