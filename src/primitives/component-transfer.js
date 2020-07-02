import React from "react";
import ReactSlider from "react-slider";

import Primitive from "../primitive.js";
import Node from "../node-ui.js";
import SVGTag from "../svg-tag.js";
import ComboBox from "../components/combobox.js";
import Hidable from "../components/hidable.js";
import TextInput from "../components/text-input.js";
import validators from "../components/validators.js";
import converters from "../components/converters.js";
import { arrayRange } from "../utils.js";

class ComponentTransfer extends Primitive {
  constructor() {
    super();
    this.createInput("Input", 0);
    this.createOutput("Output", 0);
    this.nodeComponentClass = ComponentTransferNode;

    this.red = new ComponentTransferFunction();
    this.green = new ComponentTransferFunction();
    this.blue = new ComponentTransferFunction();
    this.alpha = new ComponentTransferFunction();
  }

  getSVG() {
    let red = this.svgTag("feFuncR");
    this.red.fillSVGTagProps(red, this.makeMatrix);
    let green = this.svgTag("feFuncG");
    this.green.fillSVGTagProps(green, this.makeMatrix);
    let blue = this.svgTag("feFuncB");
    this.blue.fillSVGTagProps(blue, this.makeMatrix);
    let alpha = this.svgTag("feFuncA");
    this.alpha.fillSVGTagProps(alpha, this.makeMatrix);
    return this.svgTag("feComponentTransfer")
      .input("in", 0)
      .output("result", 0)
      .child(red)
      .child(green)
      .child(blue)
      .child(alpha);
  }
}

class ComponentTransferFunction {
  constructor() {
    this.type = "identity";
    this.types = ["identity", "table", "discrete", "linear", "gamma"];
    this.tableValues = [0.2, 0.8, 0.9];

    this.slope = 1.0;
    this.intercept = 0.0;
    this.amplitude = 1.0;
    this.exponent = 1.0;
    this.offset = 0.0;
  }

  fillSVGTagProps(tag, matrixMaker) {
    tag.arg("type", this.type, "identity");
    if (this.type == "table" || this.type == "discrete") {
      tag.arg("tableValues", matrixMaker([this.tableValues]), null);
    } else if (this.type == "linear") {
      tag.arg("slope", this.slope, null).arg("intercept", this.intercept, null);
    } else if (this.type == "gamma") {
      tag
        .arg("amplitude", this.amplitude, null)
        .arg("exponent", this.exponent, null)
        .arg("offset", this.offset, null);
    }
  }
}

class ComponentTransferFunctionComponent extends React.Component {
  render() {
    return (
      <div className="vertical">
        <ComboBox
          value={this.props.function.type}
          width={this.props.width}
          label="type:"
          values={this.props.function.types.map((val) => {
            return { value: val, label: val };
          })}
          onChange={(val) => this.props.onChange("type", val)}
        />
        {this.props.function.type == "table" ||
        this.props.function.type == "discrete"
          ? this.renderTableEditor()
          : null}
        {this.props.function.type == "linear"
          ? this.renderFieldEditor("slope", "slope")
          : null}
        {this.props.function.type == "linear"
          ? this.renderFieldEditor("intercept", "intercept")
          : null}
        {this.props.function.type == "gamma"
          ? this.renderFieldEditor("amplitude", "amplitude")
          : null}
        {this.props.function.type == "gamma"
          ? this.renderFieldEditor("exponent", "exponent")
          : null}
        {this.props.function.type == "gamma"
          ? this.renderFieldEditor("offset", "offset")
          : null}
      </div>
    );
  }

  renderFieldEditor(label, property) {
    return (
      <div className="horizontal">
        <div className="label">{label}:</div>
        <TextInput
          value={this.props.function[property]}
          onChange={(val) => this.props.onChange(property, val)}
          validator={validators.isNumber}
          converter={converters.float}
        />
      </div>
    );
  }

  renderTableEditor() {
    return (
      <TableEditor
        values={this.props.function.tableValues}
        onChange={(index, val) => {
          this.props.function.tableValues[index] = val;
          this.props.onChange("tableValues", this.props.function.tableValues);
        }}
        onAdded={(after) => {
          let value;
          if (after == this.props.function.tableValues.length - 1) {
            value = this.props.function.tableValues[after];
          } else {
            value =
              (this.props.function.tableValues[after] +
                this.props.function.tableValues[after + 1]) /
              2;
          }
          this.props.function.tableValues.splice(after + 1, 0, value);
          this.props.onChange("tableValues", this.props.function.tableValues);
        }}
        onRemoved={(index) => {
          this.props.function.tableValues.splice(index, 1);
          this.props.onChange("tableValues", this.props.function.tableValues);
        }}
        type={this.props.function.type}
      />
    );
  }
}

class ComponentTransferNode extends Node {
  constructor() {
    super();
    this.title = "Component transfer";
  }

  renderEditor() {
    let previewId = "filter" + this.props.primitive.id;
    return (
      <div className="vertical">
        {[
          { label: "Red", property: "red" },
          { label: "Green", property: "green" },
          { label: "Blue", property: "blue" },
          { label: "Alpha", property: "alpha" },
        ].map((func) => (
          <Hidable key={func.property} name={func.label} defaultShown={false}>
            <ComponentTransferFunctionComponent
              function={this.props.primitive[func.property]}
              width={this.props.primitive.nodeWidth - 18}
              onChange={(property, value) =>
                this.valArraySetter(func.property, [property])(value)
              }
            />
          </Hidable>
        ))}

        <hr />
        <Hidable name="Preview">
          <svg width="140" height="40">
            <defs>
              <filter id={previewId}>
                {this.props.primitive.getSVG().makeReactComponent()}
              </filter>
              <linearGradient id="red">
                <stop offset="0%" stopColor="#F00" />
                <stop offset="100%" stopColor="#000" />
              </linearGradient>
              <linearGradient id="green">
                <stop offset="0%" stopColor="#0F0" />
                <stop offset="100%" stopColor="#000" />
              </linearGradient>
              <linearGradient id="blue">
                <stop offset="0%" stopColor="#00F" />
                <stop offset="100%" stopColor="#000" />
              </linearGradient>
            </defs>

            <rect
              width="140"
              height="10"
              x="0"
              y="0"
              fill="url(#red)"
              filter={`url(#${previewId})`}
            />
            <rect
              width="140"
              height="10"
              x="0"
              y="15"
              fill="url(#green)"
              filter={`url(#${previewId})`}
            />
            <rect
              width="140"
              height="10"
              x="0"
              y="30"
              fill="url(#blue)"
              filter={`url(#${previewId})`}
            />
          </svg>
        </Hidable>
      </div>
    );
  }
}

class TableEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deletion: false,
    };
    this.keyPressed = this.keyPressed.bind(this);
    this.keyReleased = this.keyReleased.bind(this);
    this.windowBlur = this.windowBlur.bind(this);
  }

  componentWillMount() {
    document.addEventListener("keydown", this.keyPressed);
    document.addEventListener("keyup", this.keyReleased);
    window.addEventListener("blur", this.windowBlur);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyPressed);
    document.removeEventListener("keyup", this.keyReleased);
    window.removeEventListener("blur", this.windowBlur);
  }

  keyPressed(e) {
    if (e.key == "Control" && !this.state.deletion) {
      this.setState({ deletion: true });
    }
  }

  keyReleased(e) {
    if (e.key == "Control" && this.state.deletion) {
      this.setState({ deletion: false });
    }
  }

  windowBlur() {
    if (this.state.deletion) {
      this.setState({ deletion: false });
    }
  }

  xForIndex(index) {
    let count = this.props.values.length;
    if (this.props.type != "table") {
      count++;
    }
    return Math.round(3 + 131 * (index / (count - 1)));
  }

  render() {
    return (
      <div className="graph">
        <svg width="140" height="100">
          <g transform="translate(1.5 3.5)">
            <path d={this.makeAxis()} className="axis" />
            {arrayRange(0, 10).map((i) => (
              <line
                x1="3"
                y1={7 * i}
                x2="134"
                y2={7 * i}
                key={i}
                className="additional-line"
              />
            ))}
            <path d={this.makePlotPath()} className="plot-path" />
          </g>
        </svg>
        <div className="area">
          {arrayRange(0, this.props.values.length).map((i) => (
            <div
              className="slider-container"
              key={i}
              style={{ left: `${this.xForIndex(i)}px` }}
            >
              <ReactSlider
                max={100}
                value={this.props.values[i] * 100}
                orientation="vertical"
                onChange={(val) => this.props.onChange(i, val / 100)}
                invert={true}
              />
            </div>
          ))}
        </div>
        {this.state.deletion ? (
          <div className="add-buttons">
            {this.props.type == "table" ? (
              <div className="add-placeholder" />
            ) : null}
            {this.props.values.length <= 2
              ? null
              : arrayRange(
                  0,
                  this.props.values.length -
                    (this.props.type == "table" ? 2 : 0)
                ).map((i) => (
                  <div
                    key={i}
                    className="add-button"
                    onClick={() =>
                      this.props.onRemoved(
                        i + (this.props.type == "table" ? 1 : 0)
                      )
                    }
                  >
                    -
                  </div>
                ))}
            {this.props.type == "table" ? (
              <div className="add-placeholder" />
            ) : null}
          </div>
        ) : (
          <div className="add-buttons">
            {arrayRange(
              0,
              this.props.values.length - (this.props.type == "table" ? 1 : 0)
            ).map((i) => (
              <div
                key={i}
                className="add-button"
                onClick={() => this.props.onAdded(i)}
              >
                +
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  makePlotPath() {
    let path = "";
    if (this.props.type == "table") {
      for (let i = 0; i < this.props.values.length; i++) {
        path += i == 0 ? "M" : "L";
        path += `${this.xForIndex(i)} ${70 * (1 - this.props.values[i])}`;
      }
    } else {
      for (let i = 0; i < this.props.values.length; i++) {
        let y = 70 * (1 - this.props.values[i]);
        path += `M${this.xForIndex(i)} ${y}`;
        path += `L${this.xForIndex(i + 1)} ${y}`;
      }
    }
    return path;
  }

  makeAxis() {
    let path = "M3,0 V70 H134";
    for (let i = 0; i <= 10; i++) {
      path += `M0,${7 * i}H3`;
    }

    for (let i = 0; i < this.props.values.length; i++) {
      let position = this.xForIndex(i);
      path += `M${position},70v3`;
    }
    return path;
  }
}

module.exports = ComponentTransfer;
