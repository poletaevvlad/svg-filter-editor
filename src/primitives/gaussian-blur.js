import React from "react";

import Primitive from "../primitive.js";
import Node from "../node-ui.js";
import TextInput from "../components/text-input.js";
import validators from "../components/validators.js";
import converters from "../components/converters.js";
import SVGTag from "../svg-tag.js";

class GaussianBlur extends Primitive {
  constructor() {
    super();
    this.createInput("Input", 0);
    this.createOutput("Output", 0);
    this.nodeComponentClass = GaussianBlurNode;

    this.stdDeviation = 0.1;
  }

  createInput(name, id) {
    super.createInput(name, id);
  }

  getSVG() {
    return this.svgTag("feGaussianBlur")
      .input("in", 0)
      .output("result", 0)
      .arg("stdDeviation", this.stdDeviation, "0");
  }
}

class GaussianBlurNode extends Node {
  constructor() {
    super();
    this.title = "Gaussian Blur";
  }

  renderEditor() {
    return (
      <div className="horizontal">
        <div className="label">std. deviation:</div>
        <TextInput
          className="field"
          value={this.props.primitive.stdDeviation}
          onChange={this.valSetter("stdDeviation")}
          validator={validators.isPositiveNumber}
          converter={converters.float}
        />
      </div>
    );
  }
}

module.exports = GaussianBlur;
