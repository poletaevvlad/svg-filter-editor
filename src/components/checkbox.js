import React from "react";

class CheckBox extends React.PureComponent {
  render() {
    return (
      <span className="checkbox">
        <input
          type="checkbox"
          checked={this.props.checked}
          onChange={this.props.onChange}
        />
        <span className="checkbox-graphics" />
      </span>
    );
  }
}

module.exports = CheckBox;
