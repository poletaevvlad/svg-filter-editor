import React from "react";
import ReactSlider from "react-slider";

import Primitive from "../primitive.js";
import Node from "../node-ui.js";
import TextInput from "../components/text-input.js";
import validators from "../components/validators.js";
import ComboBox from "../components/combobox.js";
import SVGTag from "../svg-tag.js";
import ColorPicker from "../components/color-picker.js";


class Lighting extends Primitive{
	constructor(){
		super();
		this.createInput("Input", 0);
		this.createOutput("Output", 0);
		this.nodeComponentClass = LightingNode;

		this.surfaceScale = 1;
		this.constant = 1;
		this.kernelUnitLengthX = 1;
		this.kernelUnitLengthY = 1;

		this.lightType = "point";
		this.lightTypes = [{value: "point", label: "Point light"}, 
			{value: "spot", label: "Spot light"}, 
			{value: "distant", label: "Distant light"}];

		this.x = 0;
		this.y = 0;
		this.z = 0;
 	}

 	getSVG(){
 		let tag = this.svgTag("feDifuseLighting").input("in", 0).output("result", 0)
 			.arg("surfaceScale", this.surfaceScale, "1")
 			.arg("diffuseConstant", this.diffuseConstant, "1")
 			.arg("kernelUnitLength", `${primitive.kernelUnitLengthX} ${primitive.kernelUnitLengthY}`, "1 1")
 			.arg("lightingColor", "white", null);
 		if (this.lightType == "point"){
			tag.child(this.svgTag("fePointLight").arg("x", this.x, null).arg("y", primitive.y, null)
				.arg("z", primitive.z, null));
 		}
 	}
}

class LightingNode extends Node{
	constructor(){
		super();
		this.title = "Lighting";
		this._surfaceScaleChanged = this._surfaceScaleChanged.bind(this);
		this._constantChanged = this._constantChanged.bind(this);
		this._kernelUnitLengthXChanged = this._kernelUnitLengthXChanged.bind(this);
		this._kernelUnitLengthYChanged = this._kernelUnitLengthYChanged.bind(this);
		this._listTypeChanged = this._listTypeChanged.bind(this);
	}

	renderEditor(){
		return <div className="vertical-list">
			<div className="horizontalFields">
				<div className="field-section">
					<div className="field-label">surface scale:</div>
					<TextInput className="field" value={this.props.primitive.surfaceScale} 
						onChange={this._surfaceScaleChanged} validator={validators.isPositiveNumber} />
				</div>
			</div>

			<div className="horizontalFields">
				<div className="field-section">
					<div className="field-label">difuse const.:</div>
					<TextInput className="field" value={this.props.primitive.constant} 
						onChange={this._constantChanged} validator={validators.isPositiveNumber} />
				</div>
			</div>

			<div className="horizontalFields">
				<div className="field-section">
					<div className="field-label">kernel unit:</div>
					<TextInput className="field" value={this.props.primitive.kernelUnitLengthX} 
						onChange={this._kernelUnitLengthXChanged} validator={validators.isPositiveNumber} />
					<div className="field-label"></div>
					<TextInput className="field" value={this.props.primitive.kernelUnitLengthY} 
						onChange={this._kernelUnitLengthYChanged} validator={validators.isPositiveNumber} />
				</div>
			</div>

			<ComboBox value={this.props.primitive.lightType} width={this.props.primitive.nodeWidth - 18}
				values={this.props.primitive.lightTypes} label="light:" onChange={this._listTypeChanged}/>
			{ this.props.primitive.lightType == "point" ? this._renderPointLight() :
			  this.props.primitive.lightType == "spot" ? this._renderSpotLight() :
			  this.props.primitive.lightType == "distant" ? this._renderDistantLight() : null }
		</div>
	}

	_renderPointLight(){
		return <div className="horizontalFields">
			<div className="field-section">
				<div className="field-label">xyz:</div>
				<TextInput className="field" value={this.props.primitive.x} validator={validators.isNumber}
					onChange={(val) => {this.props.primitive.x = parseFloat(val.replace(",", ".")); this._update()}}/>
				<div className="field-label"></div>
				<TextInput className="field" value={this.props.primitive.y} validator={validators.isNumber}
					onChange={(val) => {this.props.primitive.y = parseFloat(val.replace(",", ".")); this._update()}}/>
				<div className="field-label"></div>
				<TextInput className="field" value={this.props.primitive.z} validator={validators.isNumber}
					onChange={(val) => {this.props.primitive.z = parseFloat(val.replace(",", ".")); this._update()}}/>
			</div>
		</div>
	}

	_renderSpotLight(){
		return null;
	}

	_renderDistantLight(){
		return null;
	}

	_update(){
		this.props.onUpdate();
		this.forceUpdate();
	}

	_surfaceScaleChanged(e){
		this.props.primitive.surfaceScale = parseFloat(e.replace(",", "."));
		this._update();
	}

	_constantChanged(e){
		this.props.primitive.constant = parseFloat(e.replace(",", "."));
		this._update();
	}

	_kernelUnitLengthXChanged(e){
		this.props.primitive.kernelUnitLengthX = parseFloat(e.replace(",", "."));
		this._update();
	}

	_kernelUnitLengthYChanged(e){
		this.props.primitive.kernelUnitLengthY = parseFloat(e.replace(",", "."));
		this._update();
	}

	_listTypeChanged(e){
		this.props.primitive.lightType = e;
		this._update();
	}
}

module.exports = Lighting;