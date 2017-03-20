import React from "react";

import Primitive from "../primitive.js";
import Node from "../node-ui.js";
import TextInput from "../components/text-input.js";
import validators from "../components/validators.js";
import SVGPrimitive from "../svg-primitive.js";
import ComboBox from "../components/combobox.js";


class ColorMatrix extends Primitive{
	constructor(){
		super();
		this.createInput("Input 1", 0);
		this.createOutput("Output", 0);

		this.nodeComponentClass = ColorMatrixNode;
		this.svgComponentClass = ColorMatrixPrimitive;

		this.type = "matrix";
		this.types = ["matrix", "saturate", "hueRotate", "luminanceToAlpha"];
		this.value = [[1, 0, 0, 0, 0], [0, 1, 0, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 1, 0]];
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
		return <div className="vertical-list">
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
		return <div className="vertical-list">
			{[0, 1, 2, 3].map(i => 
				<div key={i} className="horizontalFields compact">
					{[0, 1, 2, 3, 4].map(j => 
						<div key={j} className="field-section">
							<TextInput className="field" value={this.props.primitive.value[i][j]} 
								onChange={(val) => this._matrixValueChanged(i, j, val)} 
								validator={validators.isNumber} />
						</div>
					)}
				</div>
			)}
		</div>
	}

	_renderSaturate(){
		return null;
	}

	_renderHueRotate(){
		return null;
	}

	_renderLuminanceToAlpha(){
		return null;
	}

	_typeChanged(newType){
		this.props.primitive.type = newType;
		this.props.onUpdate();
		this.forceUpdate();
	}

	_valueChanged(newValue){
		this.props.primitive.value = parseFloat(newValue.replace(",", "."));
		this.props.onUpdate();
		this.forceUpdate();
	}

	_matrixValueChanged(row, column, newValue){
		this.props.primitive.value[row][column] = parseFloat(newValue.replace(",", "."));
		this.props.onUpdate();
		this.forceUpdate();

	}
}

class ColorMatrixPrimitive extends SVGPrimitive{
	render(){
		switch(this.props.primitive.type){
			case "matrix":
				return <feColorMatrix in={this.getInput(0)} result={this.getOutput(0)} type="matrix"
					values={this._makeMatrix()} />
			case "saturate":
				return null;
			case "hueRotate":
				return null;
			case "luminanceToAlpha":
				return null;
			default:
				return null;
		}
	}

	_makeMatrix(){
		let matrix = this.props.primitive.value;
		let matrixString = ""
		for (let i = 0; i < 4; i++){
			for (let j = 0; j < 5; j++){
				matrixString += `${matrix[i][j]} `;
			}
		}
		return matrixString;
	}
}

module.exports = ColorMatrix;