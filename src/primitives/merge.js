import React from "react";

import Primitive from "../primitive.js";
import Node from "../node-ui.js";
import TextInput from "../components/text-input.js";
import validators from "../components/validators.js";
import SVGTag from "../svg-tag.js";

class Merge extends Primitive {
  constructor() {
    super();
    this.createInput("Input 1", 0);
    this.createOutput("Output", 0);
    this.nodeComponentClass = MergeNode;
  }

  onConnectionsChanged() {
    let inputsCount = this.inputs.length;
    while (inputsCount > 0 && this.inputs[inputsCount - 1].connection == null) {
      inputsCount--;
    }
    inputsCount++;
    if (inputsCount < this.inputs.length) {
      this.inputs.splice(inputsCount, this.inputs.length - inputsCount);
    } else
      while (inputsCount > this.inputs.length) {
        this.createInput(`Input ${this.inputs.length + 1}`, this.inputs.length);
      }
  }

  getSVG() {
    let tag = this.svgTag("feMerge").output("result", 0);

    if (this.inputs.length == 1) {
      tag.child(this.svgTag("feMergeNode").arg("in", "SourceGraphic", null));
    } else {
      for (let i = 0; i < this.inputs.length - 1; i++) {
        let connection = this.getInputName(this.inputs[i].id);
        if (typeof connection != "undefined") {
          tag.child(this.svgTag("feMergeNode").arg("in", connection, null));
        }
      }
    }
    return tag;
  }
}

class MergeNode extends Node {
  constructor() {
    super();
    this.title = "Merge";
  }

  renderEditor() {
    return null;
  }
}

module.exports = Merge;
