import React from "react";

import Primitive from "../primitive.js";
import Node from "../node-ui.js";
import TextInput from "../components/text-input.js";
import validators from "../components/validators.js";
import converters from "../components/converters.js";
import ComboBox from "../components/combobox.js";
import SVGTag from "../svg-tag.js";

class Composite extends Primitive {
  constructor() {
    super();
    this.createInput("Input 1", 0);
    this.createInput("Input 2", 1);
    this.createOutput("Output", 0);
    this.nodeComponentClass = CompositeNode;

    this.operator = "over";
    this.operators = ["over", "in", "out", "atop", "xor", "arithmetic"];
    this.k1 = 0;
    this.k2 = 0;
    this.k3 = 0;
    this.k4 = 0;
  }

  getSVG() {
    let tag = this.svgTag("feComposite")
      .arg("operator", this.operator, null)
      .input("in", 0)
      .input("in2", 1)
      .output("result", 0);
    if (this.operator == "arithmetic") {
      tag
        .arg("k1", this.k1, null)
        .arg("k2", this.k2, null)
        .arg("k3", this.k3, null)
        .arg("k4", this.k4, null);
    }
    return tag;
  }
}

class CompositeNode extends Node {
  constructor() {
    super();
    this.title = "Composite";
  }

  renderEditor() {
    return (
      <div className="vertical">
        <ComboBox
          value={this.props.primitive.operator}
          width={this.props.primitive.nodeWidth - 18}
          values={this.props.primitive.operators.map((op) => {
            return { value: op, label: op };
          })}
          label="operator:"
          onChange={this.valSetter("operator")}
        />
        {this.props.primitive.operator == "arithmetic" ? (
          <div className="horizontal">
            <TextInput
              className="field"
              value={this.props.primitive.k1}
              validator={validators.isNumber}
              onChange={this.valSetter("k1")}
              converter={converters.float}
            />
            <TextInput
              className="field"
              value={this.props.primitive.k2}
              validator={validators.isNumber}
              onChange={this.valSetter("k2")}
              converter={converters.float}
            />
            <TextInput
              className="field"
              value={this.props.primitive.k3}
              validator={validators.isNumber}
              onChange={this.valSetter("k3")}
              converter={converters.float}
            />
            <TextInput
              className="field"
              value={this.props.primitive.k4}
              validator={validators.isNumber}
              onChange={this.valSetter("k4")}
              converter={converters.float}
            />
          </div>
        ) : null}
      </div>
    );
  }

  _parse(val) {
    return parseFloat(val.replace(",", "."));
  }
}

module.exports = Composite;
