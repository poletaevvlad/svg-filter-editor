import React from "react";

import Offset from "./primitives/offset.js";
import GaussianBlur from "./primitives/gaussian-blur.js";
import Merge from "./primitives/merge.js";
import Blend from "./primitives/blend.js";
import Morphology from "./primitives/morphology.js";
import ColorMatrix from "./primitives/color-matrix.js";
import Flood from "./primitives/flood.js";
import Turbulence from "./primitives/turbulence.js";
import { DiffuseLighting, SpecularLighting } from "./primitives/lighting.js";
import Input from "./primitives/input.js";
import Composite from "./primitives/composite.js";
import ConvolveMatrix from "./primitives/convolve-matrix.js";
import ComponentTransfer from "./primitives/component-transfer.js";
import DisplacementMap from "./primitives/displacement-map.js";
import Image from "./primitives/image.js";

class NodeSelector extends React.PureComponent {
  constructor(props) {
    super();
    this.addPrimitive = this.addPrimitive.bind(this);
    this.state = {
      x: props.x + 5,
      y: props.y + 5,
    };
  }

  componentDidMount() {
    let rect = this.refs.root.getBoundingClientRect();
    let containerRect = document
      .getElementById("nodes-container")
      .getBoundingClientRect();
    let x = this.state.x;
    let y = this.state.y;
    if (x < 5) {
      x = 5;
    } else if (x > containerRect.width - rect.width - 5) {
      x = containerRect.width - rect.width - 5;
    }

    if (y < 5) {
      y = 5;
    } else if (y > containerRect.height - rect.height - 5) {
      y = containerRect.height - rect.height - 5;
    }
    this.setState({ x: x, y: y });
  }

  render() {
    return (
      <div
        ref="root"
        id="node-selector"
        style={{ left: this.state.x, top: this.state.y }}
      >
        <div className="column">
          <div className="section">Inputs</div>
          <div className="item" onClick={this.addPrimitive(new Input())}>
            Input
          </div>
          <div className="item" onClick={this.addPrimitive(new Flood())}>
            Flood
          </div>
          <div className="item" onClick={this.addPrimitive(new Image())}>
            Image
          </div>
          <div className="item" onClick={this.addPrimitive(new Turbulence())}>
            Turbulence
          </div>

          <div className="section">Lighting</div>
          <div
            className="item"
            onClick={this.addPrimitive(new DiffuseLighting())}
          >
            Difuse lighting
          </div>
          <div
            className="item"
            onClick={this.addPrimitive(new SpecularLighting())}
          >
            Specular lighting
          </div>
        </div>
        <div className="column">
          <div className="section">Geometry manipulation</div>
          <div className="item" onClick={this.addPrimitive(new Offset())}>
            Offset
          </div>
          <div
            className="item"
            onClick={this.addPrimitive(new ConvolveMatrix())}
          >
            Convolve matrix
          </div>
          <div
            className="item"
            onClick={this.addPrimitive(new DisplacementMap())}
          >
            Displacement map
          </div>
          <div className="item" onClick={this.addPrimitive(new GaussianBlur())}>
            Gaussian blur
          </div>
          <div className="item" onClick={this.addPrimitive(new Morphology())}>
            Morphology
          </div>
        </div>
        <div className="column">
          <div className="section">Combining</div>
          <div className="item" onClick={this.addPrimitive(new Blend())}>
            Blend
          </div>
          <div className="item" onClick={this.addPrimitive(new Composite())}>
            Composite
          </div>
          <div className="item" onClick={this.addPrimitive(new Merge())}>
            Merge
          </div>

          <div className="section">Color manipulation</div>
          <div className="item" onClick={this.addPrimitive(new ColorMatrix())}>
            Color matrix
          </div>
          <div
            className="item"
            onClick={this.addPrimitive(new ComponentTransfer())}
          >
            Component transfer
          </div>
        </div>
      </div>
    );
  }

  addPrimitive(component) {
    return (e) => {
      if (typeof this.props.onSelected != "undefined") {
        this.props.onSelected(component);
      }
    };
  }
}

module.exports = NodeSelector;
