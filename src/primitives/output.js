import Primitive from "../primitive.js";
import Node from "../node-ui.js";

class Output extends Primitive {
  constructor() {
    super();
    this.createInput("Result", 0);
    this.isRemovable = false;
    this.nodeComponentClass = OutputNode;
  }
}

class OutputNode extends Node {
  constructor() {
    super();
    this.title = "Output";
  }

  renderEditor() {
    return "Connect your nodes to the Result input";
  }
}

module.exports = Output;
