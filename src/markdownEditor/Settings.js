import React from "react";
import CusColorPicker from "./ColorPicker";
import Switch from "@material-ui/core/Switch";
import { I18n } from "react-i18nify";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

export default props => (
  <div style={{ width: "550px", height: "380px" }}>
    <div className="setting-row">
      <span className="setting-key">{I18n.t("language")}:</span>
      <span className="setting-value">
        <Select
          value={props.lang}
          onChange={e => {
            I18n.setLocale(e.target.value);
            props.handleSettingChange("lang", e.target.value, "settings");
          }}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="zh">简体中文</MenuItem>
        </Select>
      </span>
    </div>
    <div className="setting-row">
      <span className="setting-key">{I18n.t("theme")}:</span>
      <span className="setting-value" style={{ marginTop: "7px" }}>
        <CusColorPicker
          onChange={props.handleSettingChange}
          color={props.primaryColor}
        />
      </span>
    </div>
    <div className="setting-row">
      <span className="setting-key">{I18n.t("auto save")}:</span>
      <span className="setting-value">
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
