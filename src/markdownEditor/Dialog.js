import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

class AlertDialog extends React.Component {
  render() {
    const { title, content, open, toggleDialog } = this.props;
    return (
      <div>
        <Dialog
          open={open}
          onClose={() => toggleDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
          <DialogContent className="dialog-content">{content}</DialogContent>
          <DialogActions>
            <Button onClick={() => toggleDialog(false)} color="primary">
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => toggleDialog(true)}
              color="secondary"
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default AlertDialog;
