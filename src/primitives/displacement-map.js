import React from "react";
import ReactSlider from "react-slider";

import Primitive from "../primitive.js";
import Node from "../node-ui.js";
import TextInput from "../components/text-input.js";
import validators from "../components/validators.js";
import converters from "../components/converters.js";
import ComboBox from "../components/combobox.js";
import SVGTag from "../svg-tag.js";
import focused from "../components/focused.js";
import Selector from "../components/selector.js";

class DisplacementMap extends Primitive {
  constructor() {
    super();
    this.createInput("Input", 0);
    this.createInput("Displacement", 1);
    this.createOutput("Output", 0);
    this.nodeComponentClass = DisplacementMapNode;

    this.scale = 0;
    this.xChannelSelector = "A";
    this.yChannelSelector = "A";
    this.channelSelectors = ["R", "G", "B", "A"];

    this.alpha = 1;
  }

  getSVG() {
    return this.svgTag("feDisplacementMap")
      .output("result", 0)
      .input("in", 0)
      .input("in2", 1)
      .arg("scale", this.scale, "0")
      .arg("xChannelSelector", this.xChannelSelector, "A")
      .arg("yChannelSelector", this.yChannelSelector, "A");
  }
}

class DisplacementMapNode extends Node {
  constructor() {
    super();
    this.title = "DisplacementMap";
  }

  renderEditor() {
    return (
      <div className="vertical">
        <div className="horizontal">
          <div className="label">scale:</div>
          <TextInput
            className="field"
            value={this.props.primitive.scale}
            onChange={this.valSetter("scale")}
            validator={validators.isNumber}
            converter={converters.float}
          />
        </div>

        <div className="horizontal">
          <div className="label">x channel:</div>
          <Selector
            values={this.props.primitive.channelSelectors.map((val) => {
              return { value: val, class: "", label: val };
            })}
            value={this.props.primitive.xChannelSelector}
            onChange={this.valSetter("xChannelSelector")}
          />
        </div>

        <div className="horizontal">
          <div className="label">y channel:</div>
          <Selector
            values={this.props.primitive.channelSelectors.map((val) => {
              return { value: val, class: "", label: val };
            })}
            value={this.props.primitive.yChannelSelector}
            onChange={this.valSetter("yChannelSelector")}
          />
        </div>
      </div>
    );
  }
}

module.exports = DisplacementMap;
