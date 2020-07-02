import React from "react";
import ReactSlider from "react-slider";

import Primitive from "../primitive.js";
import Node from "../node-ui.js";
import TextInput from "../components/text-input.js";
import validators from "../components/validators.js";
import converters from "../components/converters.js";
import ComboBox from "../components/combobox.js";
import SVGTag from "../svg-tag.js";
import ColorPicker from "../components/color-picker.js";

class Lighting extends Primitive {
  constructor(props) {
    super();
    this.createInput("Input", 0);
    this.createOutput("Output", 0);
    this.nodeComponentClass = LightingNode;

    this.isDiffuse = true;
    this.surfaceScale = 1;
    this.constant = 1;
    this.exponent = 1;
    this.kernelUnitLengthX = 1;
    this.kernelUnitLengthY = 1;

    this.lightType = "point";
    this.lightTypes = [
      { value: "point", label: "Point light" },
      { value: "spot", label: "Spot light" },
      /*{value: "distant", label: "Distant light"}*/
    ];

    this.x = 0;
    this.y = 0;
    this.z = 0;

    this.pointsAtX = 0;
    this.pointsAtY = 0;
    this.pointsAtZ = 0;

    this.azimuth = 0;
    this.elevation = 0;
  }

  getSVG() {
    let tag = this.svgTag(
      this.isDiffuse ? "feDiffuseLighting" : "feSpecularLighting"
    )
      .input("in", 0)
      .output("result", 0)
      .arg("surfaceScale", this.surfaceScale, "1")
      .arg(
        this.isDiffuse ? "diffuseConstant" : "specularConstant",
        this.constant,
        "1"
      )
      .arg(
        "kernelUnitLength",
        `${this.kernelUnitLengthX} ${this.kernelUnitLengthY}`,
        "1 1"
      )
      .arg("lightingColor", "white", null);
    if (!this.isDiffuse) {
      tag.arg("specularExponent", this.exponent, null);
    }
    if (this.lightType == "point") {
      tag.child(
        this.svgTag("fePointLight")
          .arg("x", this.x, null)
          .arg("y", this.y, null)
          .arg("z", this.z, null)
      );
    } else if (this.lightType == "distant") {
      tag.child(
        this.svgTag("feDistantLight")
          .arg("azimuth", azimuth, null)
          .arg("elevation", this.elevation, null)
      );
    } else if (this.lightType == "spot") {
      tag.child(
        this.svgTag("feSpotLight")
          .arg("x", this.x, null)
          .arg("y", this.y, null)
          .arg("z", this.z, null)
          .arg("pointsAtX", this.pointsAtX, null)
          .arg("pointsAtY", this.pointsAtY, null)
          .arg("pointsAtZ", this.pointsAtZ, null)
      );
    }
    return tag;
  }
}

class DiffuseLighting extends Lighting {}

class SpecularLighting extends Lighting {
  constructor() {
    super();
    this.isDiffuse = false;
  }
}

class LightingNode extends Node {
  constructor(props) {
    super(props);
    this.title = props.primitive.isDiffuse
      ? "Diffuse lighting"
      : "Specular lighting";
  }

  renderEditor() {
    return (
      <div className="vertical">
        <div className="horizontal">
          <div className="label">surface scale:</div>
          <TextInput
            value={this.props.primitive.surfaceScale}
            converter={converters.float}
            onChange={this.valSetter("surfaceScale")}
            validator={validators.isGreaterThatZero}
          />
        </div>

        <div className="horizontal">
          <div className="label">
            {this.props.primitive.isDiffuse ? "difuse" : "specular"} const.:
          </div>
          <TextInput
            value={this.props.primitive.constant}
            converter={converters.float}
            onChange={this.valSetter("constant")}
            validator={validators.isPositiveNumber}
          />
        </div>

        {this.props.primitive.isDiffuse ? null : (
          <div className="section">specular exp.:</div>
        )}
        {this.props.primitive.isDiffuse ? null : (
          <div className="horizontal">
            <ReactSlider
              min={1}
              max={128}
              value={this.props.primitive.exponent}
              onChange={this.valSetter("exponent")}
            />
            <TextInput
              value={this.props.primitive.exponent}
              converter={converters.float}
              onChange={this.valSetter("exponent")}
              validator={validators.range(validators.isPositiveNumber, 1, 128)}
            />
          </div>
        )}

        <div className="horizontal">
          <div className="label">kernel unit:</div>
          <TextInput
            value={this.props.primitive.kernelUnitLengthX}
            converter={converters.float}
            onChange={this.valSetter("kernelUnitLengthX")}
            validator={validators.isPositiveNumber}
          />
          <TextInput
            value={this.props.primitive.kernelUnitLengthY}
            converter={converters.float}
            onChange={this.valSetter("kernelUnitLengthY")}
            validator={validators.isPositiveNumber}
          />
        </div>

        <ComboBox
          value={this.props.primitive.lightType}
          width={this.props.primitive.nodeWidth - 18}
          values={this.props.primitive.lightTypes}
          label="light:"
          onChange={this.valSetter("lightType")}
        />

        {this.props.primitive.lightType == "point"
          ? this._renderPointLight()
          : this.props.primitive.lightType == "spot"
          ? this._renderSpotLight()
          : this.props.primitive.lightType == "distant"
          ? this._renderDistantLight()
          : null}
      </div>
    );
  }

  _renderPointLight() {
    return (
      <div className="horizontal">
        <div className="field-label">xyz:</div>
        <TextInput
          value={this.props.primitive.x}
          converter={converters.float}
          onChange={this.valSetter("x")}
          validator={validators.isNumber}
        />
        <TextInput
          value={this.props.primitive.y}
          converter={converters.float}
          onChange={this.valSetter("y")}
          validator={validators.isNumber}
        />
        <TextInput
          value={this.props.primitive.z}
          converter={converters.float}
          onChange={this.valSetter("z")}
          validator={validators.isNumber}
        />
      </div>
    );
  }

  _renderDistantLight() {
    return null;
    return (
      <div className="vertical">
        <div className="section">azimuth:</div>
        <div className="horizontal">
          <ReactSlider
            max={360}
            value={this.props.primitive.azimuth}
            onChange={this.valSetter("azimuth")}
          />
          <TextInput
            className="field"
            value={this.props.primitive.azimuth}
            onChange={this.valSetter("azimuth")}
            validator={validators.isNumber}
            converter={converters.float}
          />
        </div>
        <div className="section">elevation:</div>
        <div className="horizontal">
          <ReactSlider
            max={360}
            value={this.props.primitive.elevation}
            onChange={this.valSetter("elevation")}
          />
          <TextInput
            className="field"
            value={this.props.primitive.elevation}
            onChange={this.valSetter("elevation")}
            validator={validators.isNumber}
            converter={converters.float}
          />
        </div>
      </div>
    );
  }

  _renderSpotLight() {
    return (
      <div className="vertical">
        <div className="horizontal">
          <div className="field-label">xyz:</div>
          <TextInput
            value={this.props.primitive.x}
            converter={converters.float}
            onChange={this.valSetter("x")}
            validator={validators.isNumber}
          />
          <TextInput
            value={this.props.primitive.y}
            converter={converters.float}
            onChange={this.valSetter("y")}
            validator={validators.isNumber}
          />
          <TextInput
            value={this.props.primitive.z}
            converter={converters.float}
            onChange={this.valSetter("z")}
            validator={validators.isNumber}
          />
        </div>

        <div className="horizontal">
          <div className="field-label">points at:</div>
          <TextInput
            value={this.props.primitive.pointsAtX}
            converter={converters.float}
            onChange={this.valSetter("pointsAtX")}
            validator={validators.isNumber}
          />
          <TextInput
            value={this.props.primitive.pointsAtY}
            converter={converters.float}
            onChange={this.valSetter("pointsAtY")}
            validator={validators.isNumber}
          />
          <TextInput
            value={this.props.primitive.pointsAtZ}
            converter={converters.float}
            onChange={this.valSetter("pointsAtZ")}
            validator={validators.isNumber}
          />
        </div>
      </div>
    );
  }
}

module.exports = {
  DiffuseLighting: DiffuseLighting,
  SpecularLighting: SpecularLighting,
};
