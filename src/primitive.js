import Node from "./node-ui.js";
import SVGTag from "./svg-tag.js";

var lastId = 0;
function generateId() {
  return ++lastId;
}

function input(title, id) {
  return { title: title, id: id, connection: null };
}

function output(title, id) {
  return { title: title, id: id };
}

class Primitive {
  constructor() {
    this.id = generateId();

    this.isRemovable = true;
    this.inputs = [];
    this.outputs = [];

    this.positionX = 50;
    this.positionY = 40;
    this.nodeWidth = 150;

    this.nodeComponentClass = Node;
    this.changed = false;
  }

  createInput(name, id) {
    this.inputs.push(input(name, id));
  }

  createOutput(name, id) {
    this.outputs.push(output(name, id));
  }

  getInputId(inp) {
    return `pr${this.id}_in${inp.id}`;
  }

  getOutputId(out) {
    return `pr${this.id}_out${out.id}`;
  }

  getInput(id) {
    return this.inputs.find((e) => e.id == id);
  }

  getOutput(id) {
    return this.outputs.find((e) => e.id == id);
  }

  getOutputName(id) {
    return `f${this.id}-${id}`;
  }

  onConnectionsChanged() {}

  getInputName(id) {
    let input = this.getInput(id);
    if (input.connection == null) {
      return "SourceGraphic";
    }
    let otherPrimitive = this.filter.getPrimitive(
      input.connection.outputPrimitive
    );
    return otherPrimitive.getOutputName(input.connection.outputIOID);
  }

  getSVG() {
    return null;
  }

  svgTag(name) {
    let tag = new SVGTag(name);
    tag.primitive = this;
    return tag;
  }

  makeMatrix(matrix) {
    let matrixString = "";
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        matrixString += `${matrix[i][j]} `;
      }
    }
    return matrixString;
  }

  setProps(props) {
    for (let key in props) {
      let oldValue = this[key];
      if (oldValue != props[key]) {
        this[key] = props[key];
        this.onPropertyValueChanged(key, oldValue, props[key]);
      }
    }
    this.changed = true;
  }

  setPropArrayValue(name, index, value) {
    if (!index instanceof Array) {
      index = [index];
    }

    let array = this[name];
    for (let i = 0; i < index.length - 1; i++) {
      array = array[index[i]];
    }
    let oldValue = array[index[index.length - 1]];
    array[index[index.length - 1]] = value;
    this.onArrayElementChanged(name, index, oldValue, value);
    this.changed = true;
  }

  onPropertyValueChanged(propertyName, oldValue, newValue) {}
  onArrayElementChanged(propertyName, index, oldValue, newValue) {}
}

Primitive.getInputId = (primitive, ioId) => `pr${primitive}_in${ioId}`;
Primitive.getOutputId = (primitive, ioId) => `pr${primitive}_out${ioId}`;

module.exports = Primitive;
