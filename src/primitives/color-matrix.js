import React from "react";
import ReactSlider from "react-slider";

import Primitive from "../primitive.js";
import Node from "../node-ui.js";
import TextInput from "../components/text-input.js";
import validators from "../components/validators.js";
import converters from "../components/converters.js";
import SVGTag from "../svg-tag.js";
import ComboBox from "../components/combobox.js";
import Hidable from "../components/hidable.js";


class ColorMatrix extends Primitive{
	constructor(){
		super();
		this.createInput("Input 1", 0);
		this.createOutput("Output", 0);

		this.nodeComponentClass = ColorMatrixNode;

		this.type = "matrix";
		this.types = ["matrix", "saturate", "hueRotate", "luminanceToAlpha"];
		this.value = [[1, 0, 0, 0, 0], [0, 1, 0, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 1, 0]];
	}

	updateValueType(){
		switch(this.type){
			case "matrix":
				this.value = [[1, 0, 0, 0, 0], [0, 1, 0, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 1, 0]];
				break;
			case "saturate":
				this.value = 1;
				break;
			default:
				this.value = 0;
		}
	}

	onPropertyValueChanged(propertyName, oldValue, newValue){
		if (propertyName == "type"){
			this.updateValueType();
		}
	}

	getSVG(){
		let tag = this.svgTag("feColorMatrix");
		let values = undefined;
		switch(this.type){
			case "matrix":
				values=this.makeMatrix(this.value);
				break;
			case "luminanceToAlpha":
				break;
			default:
				values = this.value;
		}
		tag.arg("type", this.type, null)
		if (typeof values != "undefined"){
			tag.arg("values", values, null)
		}
		tag.input("in", 0).output("result", 0)
		return tag;
	}
}

class ColorMatrixNode extends Node{
	constructor(){
		super();
		this.title = "Color matrix";
	}

	renderEditor(){
		return <div className="vertical">
			<ComboBox value={this.props.primitive.type} width={this.props.primitive.nodeWidth - 18}
				values={this.props.primitive.types.map(val => {return {value: val, label: val}})} label="type:" 
				onChange={this.valSetter("type")}/>
			{this.props.primitive.type == "matrix" ? this._renderMatrix() :
			this.props.primitive.type == "saturate" ? this._renderSaturate() :
			this.props.primitive.type == "hueRotate" ? this._renderHueRotate() :
			this.props.primitive.type == "luminanceToAlpha" ? this._renderLuminanceToAlpha() : null}
			{this._renderPreview()}
		</div>
	}

	_renderPreview(){
		if (this.props.primitive.type == "luminanceToAlpha"){
			return null;
		}
		let tag = this.props.primitive.getSVG();
		return <Hidable name="Preview">
			<svg width="140" height="50">
				<defs>
					<linearGradient id="hue" x1="0%" y1="0%" x2="100%" y2="0">
						<stop offset="0%" stopColor="#F00" />
						<stop offset="17%" stopColor="#FF0" />
						<stop offset="33%" stopColor="#0F0" />
						<stop offset="50%" stopColor="#0FF" />
						<stop offset="67%" stopColor="#00F" />
						<stop offset="83%" stopColor="#F0F" />
						<stop offset="100%" stopColor="#F00" />
					</linearGradient>
					<linearGradient id="brightness" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="transparent" />
						<stop offset="100%" stopColor="#FFF" />
					</linearGradient>
					<filter id="filter">
						{React.createElement(tag.name, tag.args, null)}
					</filter>
				</defs>
				<g filter="url(#filter)">
					<rect x="0" y="0" width="100%" height="100%" fill="url(#hue)" />
					<rect x="0" y="0" width="100%" height="100%" fill="url(#brightness)" />
				</g>
			</svg>
		</Hidable>
	}

	_renderMatrix(){
		return <div className="vertical">
			{[0, 1, 2, 3].map(i => 
				<div key={i} className="horizontal">
					{[0, 1, 2, 3, 4].map(j => 
						<TextInput key={j} value={this.props.primitive.value[i][j]} 
							onChange={this.valArraySetter("value", [i, j])} 
							validator={validators.isNumber} converter={converters.float} />
					)}
				</div>
			)}
		</div>
	}

	_renderSaturate(){
		return <div className="horizontal">
			<ReactSlider max={250} value={this.props.primitive.value * 250} 
				onChange={e => this.valSetter("value")(e / 250)} />
			<TextInput value={this.props.primitive.value} converter={converters.float}
				onChange={this.valSetter("value")} validator={validators.isNumber01} />
		</div>;
	}

	_renderHueRotate(){
		return <div className="horizontal">
			<ReactSlider max={360} value={this.props.primitive.value} onChange={this.valSetter("value")} />
			<TextInput value={this.props.primitive.value} converter={converters.float}
				onChange={this.valSetter("value")} validator={validators.isNumber} />
			<div className="label">deg.</div>
		</div>
	}

	_renderLuminanceToAlpha(){
		return null;
	}
}

module.exports = ColorMatrix;