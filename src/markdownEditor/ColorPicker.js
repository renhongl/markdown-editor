import React from "react";
import reactCSS from "reactcss";
import { BlockPicker } from "react-color";
import { rgb2hex } from "./utils";

class SketchExample extends React.Component {
  state = {
    displayColorPicker: false
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = color => {
    this.setState({ color });
  };

  render() {
    const { onChange, color } = this.props;
    console.log(color);
    const styles = reactCSS({
      default: {
        color: {
          width: "36px",
          height: "14px",
          borderRadius: "2px",
          background: color
        },
        swatch: {
          padding: "5px",
          background: "#fff",
          borderRadius: "1px",
          border: "1px solid #000",
          display: "inline-block",
          cursor: "pointer"
        },
        popover: {
          position: "absolute",
          zIndex: "2",
          boxShadow: "rgba(0, 0, 0, 0.1) 0 0px 10px",
          right: "-60px"
        },
        cover: {
          position: "fixed",
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px"
        }
      }
    });

    return (
      <div>
        <div style={styles.swatch} onClick={this.handleClick}>
          <div style={styles.color} />
        </div>
        {this.state.displayColorPicker ? (
          <div style={styles.popover}>
            <div style={styles.cover} onClick={this.handleClose} />
            <BlockPicker
              color={color}
              onChange={(color, e) => {
                const hex = rgb2hex(
                  `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`
                );
                onChange("primary", hex, e);
                this.handleChange(hex);
              }}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default SketchExample;
