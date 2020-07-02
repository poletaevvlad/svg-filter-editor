import React from "react";

import focused from "./focused.js";

class ComboBox extends React.PureComponent {
  constructor() {
    super();
    this.state = { focused: false };
    this._handleFocus = this._handleFocus.bind(this);
  }

  render() {
    let selectedLabel = "";
    for (let i = 0; i < this.props.values.length; i++) {
      if (this.props.values[i].value == this.props.value) {
        selectedLabel = this.props.values[i].label;
        break;
      }
    }
    let width = typeof this.props.width == "undefined" ? 150 : this.props.width;
    return (
      <div
        className={"select" + (this.state.focused ? " focused" : "")}
        style={{ width: width }}
      >
        <select
          value={this.props.value}
          onChange={(e) => this.props.onChange(e.target.value)}
          style={{ width: width + 6 }}
          onFocus={this._handleFocus}
          onBlur={() => this.setState({ focused: false })}
        >
          {this.props.values.map((value) => (
            <option key={value.value} value={value.value}>
              {value.label}
            </option>
          ))}
        </select>
        <div className="display-value">
          {this.props.label} <span className="value">{selectedLabel}</span>
        </div>

        <div className="dropdown-icon"></div>
      </div>
    );
  }

  _handleFocus() {
    this.setState({ focused: true });
    focused(this);
  }
}

module.exports = ComboBox;
