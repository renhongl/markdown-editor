import DocumentList from "./DocumentList";
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { I18n } from "react-i18nify";

const styles = theme => ({
  root: {
    width: "100%",
    margin: "0 auto"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  panelDetails: {
    padding: 0
  }
});

function SimpleExpansionPanel(props) {
  const {
    classes,
    fileList,
    switchCurrent,
    toggleDrawer,
    addDocment,
    deleteAction,
    saveDoc,
    current
  } = props;
  return (
    <div className={classes.root}>
      <ExpansionPanel defaultExpanded={true} className="document-list">
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>
            {I18n.t("documents")}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.panelDetails}>
          <DocumentList
            fileList={fileList}
            switchCurrent={switchCurrent}
            toggleDrawer={toggleDrawer}
            addDocment={addDocment}
            deleteAction={deleteAction}
            saveDoc={saveDoc}
            current={current}
          />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}

SimpleExpansionPanel.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleExpansionPanel);
