import React from "react";

import Primitive from "../primitive.js";
import Node from "../node-ui.js";
import TextInput from "../components/text-input.js";
import validators from "../components/validators.js";
import ComboBox from "../components/combobox.js";
import converters from "../components/converters.js";
import SVGTag from "../svg-tag.js";

class Image extends Primitive {
  constructor() {
    super();
    this.createOutput("Output", 0);
    this.nodeComponentClass = ImageNode;

    this.url = "https://www.w3.org/Icons/SVG/svg-w3c-h.svg";
    this.x = 0;
    this.y = 0;
    this.width = 1;
    this.height = 1;
    this.preserveAspectRatio = "none";
    this.aspectRatios = [
      "none",
      "xMinYMin",
      "xMidYMin",
      "xMaxYMin",
      "xMinYMid",
      "xMidYMid",
      "xMaxYMid",
      "xMinYMax",
      "xMidYMax",
      "xMaxYMax",
    ];
  }

  getSVG() {
    return this.svgTag("feImage")
      .output("result", 0)
      .arg("xlinkHref", this.url, null)
      .arg("x", this.x, null)
      .arg("y", this.y, null)
      .arg("width", this.width, null)
      .arg("height", this.height, null)
      .arg("preserveAspectRatio", this.preserveAspectRatio, "null");
  }
}

class ImageNode extends Node {
  constructor() {
    super();
    this.title = "Image";
    this.state = {};

    this._stdDeviationChanged = this._stdDeviationChanged.bind(this);
  }

  renderEditor() {
    return (
      <div className="vertical">
        <div className="section">URL:</div>
        <TextInput
          value={this.props.primitive.url}
          onChange={this.valSetter("url")}
        />

        <div className="horizontal">
          <div className="label">x:</div>
          <TextInput
            className="field"
            value={this.props.primitive.x}
            onChange={this.valSetter("x")}
            validator={validators.isNumber}
            converter={converters.float}
          />
          <div className="label inline-next">y:</div>
          <TextInput
            className="field"
            value={this.props.primitive.y}
            onChange={this.valSetter("y")}
            validator={validators.isNumber}
            converter={converters.float}
          />
        </div>
        <div className="horizontal">
          <div className="label">w:</div>
          <TextInput
            className="field"
            value={this.props.primitive.width}
            onChange={this.valSetter("width")}
            validator={validators.isNumber}
            converter={converters.float}
          />
          <div className="label inline-next">h:</div>
          <TextInput
            className="field"
            value={this.props.primitive.height}
            onChange={this.valSetter("height")}
            validator={validators.isNumber}
            converter={converters.float}
          />
        </div>

        <ComboBox
          value={this.props.primitive.preserveAspectRatio}
          width={this.props.primitive.nodeWidth - 18}
          label="aspect ratio:"
          values={this.props.primitive.aspectRatios.map((val) => {
            return { value: val, label: val };
          })}
          onChange={this.valSetter("preserveAspectRatio")}
        />
      </div>
    );
  }

  _stdDeviationChanged(newValue) {
    this.props.primitive.stdDeviation = parseFloat(newValue.replace(",", "."));
    this.setState(this.state);
    this.props.onUpdate();
  }
}

module.exports = Image;
