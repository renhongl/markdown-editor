import React from "react";
import CusColorPicker from "./ColorPicker";
import Switch from "@material-ui/core/Switch";
// import Select from "@material-ui/core/Select";
// import MenuItem from "@material-ui/core/MenuItem";

export default props => (
  <div style={{ width: "550px", height: "500px" }}>
    {/* <div className="setting-row">
      <span className="setting-key">Language:</span>
      <span className="setting-value" style={{ marginTop: "7px" }}>
        <Select value="en">
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="zh">简体中文</MenuItem>
        </Select>
      </span>
    </div> */}
    <div className="setting-row">
      <span className="setting-key">Theme:</span>
      <span className="setting-value" style={{ marginTop: "7px" }}>
        <CusColorPicker
          onChange={props.handleSettingChange}
          color={props.primaryColor}
        />
      </span>
    </div>
    <div className="setting-row">
      <span className="setting-key">Auto Save:</span>
      <span className="setting-value" style={{ marginRight: "-56px" }}>
        <Switch
          checked={props.autoSave}
          onChange={(e, value) =>
            props.handleSettingChange("autoSave", value, "settings")
          }
          value={props.autoSave}
          color="primary"
        />
      </span>
    </div>
  </div>
);
