import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";

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
  },
  selectedItem: {
    marginTop: "10px",
    color: "red"
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
    const { classes, fileList, deleteAction, current, openFile } = this.props;
    return (
      <List className={classes.root}>
        {fileList.map((item, index) => (
          <ListItem
            key={item.id}
            selected={index === current}
            className={classes.listItem}
            dense
            button
            onClick={() => {
              openFile(index);
              this.handleToggle();
            }}
          >
            <ListItemText
              primary={item.title}
              onClick={this.handleAction(index)}
            />
            <ListItemSecondaryAction>
              <IconButton onClick={() => deleteAction(item.id)}>
                <i className="material-icons">delete</i>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    );
  }
}

CheckboxList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CheckboxList);
