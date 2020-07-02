import React from "react";

import focused from "./focused.js";
import validators from "./validators.js";
import converters from "./converters.js";

class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this._handleChange = this._onChange.bind(this);
    this._handleBlur = this._onBlur.bind(this);
    this._handleFocus = this._onFocus.bind(this);

    this.state = {
      value: props.value,
      valid: true,
      focused: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.focused) {
      this.setState({ value: nextProps.value });
    }
  }

  render() {
    return (
      <input
        className={this.props.className + (this.state.valid ? "" : " invalid")}
        type="text"
        value={this.state.value}
        onChange={this._handleChange}
        onFocus={this._handleFocus}
        onBlur={this._handleBlur}
        disabled={!this.props.enabled}
      />
    );
  }

  _onChange(e) {
    let valid = this.props.validator(e.target.value);
    if (valid != validators.INVALID) {
      this.setState({
        value: e.target.value,
        valid: valid == validators.VALID,
      });
    }
    if (valid == validators.VALID) {
      this.props.onChange(this.props.converter(e.target.value), e);
    }
  }

  _onBlur(e) {
    if (this.state.valid) {
      this._onChange(e);
    }

    this.setState({ value: this.props.value, valid: true, focused: false });
  }

  _onFocus(e) {
    focused(this);
    this.state.focused = true;
    this.setState(this.state);
  }
}

TextInput.defaultProps = {
  className: "field",
  validator: validators.any,
  converter: converters.passthrough,
  onChange: () => {},
  enabled: true,
};

module.exports = TextInput;
