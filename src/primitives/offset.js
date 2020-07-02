import React from "react";

import Primitive from "../primitive.js";
import Node from "../node-ui.js";
import TextInput from "../components/text-input.js";
import validators from "../components/validators.js";
import converters from "../components/converters.js";
import SVGTag from "../svg-tag.js";

class Offset extends Primitive {
  constructor() {
    super();
    this.createInput("Input", 0);
    this.createOutput("Output", 0);
    this.nodeComponentClass = OffsetNode;
    this.x = 0;
    this.y = 0;
  }

  getSVG() {
    return this.svgTag("feOffset")
      .arg("dx", this.x, "0")
      .arg("dy", this.y, "0")
      .input("in", 0)
      .output("result", 0);
  }
}

class OffsetNode extends Node {
  constructor() {
    super();
    this.title = "Offset";
  }

  renderEditor() {
    return (
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
    );
  }
}

module.exports = Offset;
