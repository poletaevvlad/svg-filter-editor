import React from "react";
import ReactSlider from "react-slider";

import Primitive from "../primitive.js";
import Node from "../node-ui.js";
import TextInput from "../components/text-input.js";
import validators from "../components/validators.js";
import SVGTag from "../svg-tag.js";
import ComboBox from "../components/combobox.js";


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

	getSVG(){
		let tag = this.svgTag("feColorMatrix");
		let values = undefined;
		switch(this.type){
			case "matrix":
				values=this._makeMatrix();
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

	_makeMatrix(){
		let matrix = this.value;
		let matrixString = ""
		for (let i = 0; i < 4; i++){
			for (let j = 0; j < 5; j++){
				matrixString += `${matrix[i][j]} `;
			}
		}
		return matrixString;
	}
}

class ColorMatrixNode extends Node{
	constructor(){
		super();
		this.title = "Color matrix";
		this._typeChanged = this._typeChanged.bind(this);
		this._valueChanged = this._valueChanged.bind(this);
	}

	renderEditor(){
		return <div className="vertical">
			<ComboBox value={this.props.primitive.type} width={this.props.primitive.nodeWidth - 18}
				values={this.props.primitive.types.map(type => {return {value: type, label: type}})} 
				label="type:" onChange={this._typeChanged}/>
			{this.props.primitive.type == "matrix" ? this._renderMatrix() :
			this.props.primitive.type == "saturate" ? this._renderSaturate() :
			this.props.primitive.type == "hueRotate" ? this._renderHueRotate() :
			this.props.primitive.type == "luminanceToAlpha" ? this._renderLuminanceToAlpha() : null}
		</div>
	}

	_renderMatrix(){
		return <div className="vertical">
			{[0, 1, 2, 3].map(i => 
				<div key={i} className="horizontal">
					{[0, 1, 2, 3, 4].map(j => 
						<TextInput key={j} className="field" value={this.props.primitive.value[i][j]} 
							onChange={(val) => this._matrixValueChanged(i, j, val)} 
							validator={validators.isNumber} />
					)}
				</div>
			)}
		</div>
	}

	_renderSaturate(){
		return <div className="horizontal">
			<ReactSlider max={250} value={this.props.primitive.value * 250} onChange={e => this._valueChanged(e / 250)}/>
			<TextInput className="field" value={this.props.primitive.value} 
				onChange={this._valueChanged} validator={validators.isNumber01} />
		</div>;
	}

	_renderHueRotate(){
		return <div className="horizontal">
			<TextInput className="field" value={this.props.primitive.value} 
				onChange={this._valueChanged} validator={validators.isNumber} />
			<div className="label">deg.</div>
		</div>
	}

	_renderLuminanceToAlpha(){
		return null;
	}

	_typeChanged(newType){
		this.props.primitive.type = newType;
		this.props.primitive.updateValueType();
		this.props.onUpdate();
		this.forceUpdate();
	}

	_valueChanged(newValue){
		this.props.primitive.value = typeof newValue == "number" ? newValue : parseFloat(newValue.replace(",", "."));
		this.props.onUpdate();
		this.forceUpdate();
	}

	_matrixValueChanged(row, column, newValue){
		this.props.primitive.value[row][column] = parseFloat(newValue.replace(",", "."));
		this.props.onUpdate();
		this.forceUpdate();

	}
}

module.exports = ColorMatrix;