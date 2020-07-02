import React from "react";

import ComboBox from "./components/combobox.js";
import ColorPicker from "./components/color-picker.js";
import Selector from "./components/selector.js";
import TextInput from "./components/text-input.js";
import validators from "./components/validators.js";
import focused from "./components/focused.js";
import CheckBox from "./components/checkbox.js";

class BackgroundEditor extends React.Component {
  constructor() {
    super();
    this.types = [
      { value: "transparent", label: "Transparent" },
      { value: "color", label: "Solid color" },
      { value: "checkerboard", label: "Checkerboard" },
    ];

    this.checkerboardTypes = [
      { value: "dark", class: "checkerboard-dark", label: "" },
      { value: "light", class: "checkerboard-light", label: "" },
      { value: "contrast", class: "checkerboard-contrast", label: "" },
    ];
  }

  render() {
    return (
      <div className="vertical">
        <ComboBox
          value={this.props.type}
          width={200 - 18}
          values={this.types}
          label="background type:"
          onChange={this.props.onTypeChange}
        />
        {this.props.type == "color" ? (
          <div className="content">
            <ColorPicker
              color={this.props.color}
              onChange={this.props.onColorChanged}
            />
          </div>
        ) : this.props.type == "checkerboard" ? (
          <div className="content">
            <Selector
              values={this.checkerboardTypes}
              value={this.props.checkerboard}
              onChange={this.props.onCheckerboardChanged}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

class ShapeEditor extends React.Component {
  constructor() {
    super();
    this.shapes = [
      { value: "ellipse", label: "Ellipse" },
      { value: "rect", label: "Rectangle" },
      { value: "path", label: "Path" },
    ];
  }

  render() {
    return (
      <div className="vertical">
        <ComboBox
          value={this.props.shape}
          width={200 - 18}
          values={this.shapes}
          label="shape:"
          onChange={this.props.onShapeChange}
        />
        {this.props.shape == "rect" || this.props.shape == "ellipse" ? (
          <div className="content horizontal">
            <div className="label">width:</div>
            <TextInput
              value={this.props.width}
              onChange={this.props.onWidthChange}
              validator={validators.isPositiveNumber}
            />
            <div className="label">height:</div>
            <TextInput
              value={this.props.height}
              onChange={this.props.onHeightChange}
              validator={validators.isPositiveNumber}
            />
          </div>
        ) : this.props.shape == "path" ? (
          <div className="content">
            <textarea
              rows="3"
              value={this.props.path}
              onChange={this.props.onPathChange}
            />
          </div>
        ) : null}

        <label className="horizontal align-middle section-name field-section">
          <CheckBox
            checked={this.props.fillEnabled}
            onChange={this.props.onFillEnabledChange}
          />
          <div className="label">Fill</div>
        </label>
        {this.props.fillEnabled ? (
          <ColorPicker
            color={this.props.fillColor}
            onChange={this.props.onFillColorChange}
          />
        ) : null}

        <label className="horizontal align-middle section-name field-section">
          <CheckBox
            checked={this.props.strokeEnabled}
            onChange={this.props.onStrokeEnabledChange}
          />
          <div className="field-label">Stroke</div>
        </label>
        {this.props.strokeEnabled ? (
          <div>
            <ColorPicker
              color={this.props.strokeColor}
              onChange={this.props.onStrokeColorChange}
            />
            <div className="horizontal offset-top">
              <div className="label">stroke width:</div>
              <TextInput
                value={this.props.strokeWidth}
                onChange={this.props.onStrokeWidthChange}
                validator={validators.isNumber}
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

module.exports = {
  ShapeEditor: ShapeEditor,
  BackgroundEditor: BackgroundEditor,
};
