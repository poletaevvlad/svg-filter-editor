import React from "react";

import Primitive from "../primitive.js";
import Node from "../node-ui.js";
import TextInput from "../components/text-input.js";
import validators from "../components/validators.js";
import ComboBox from "../components/combobox.js";
import SVGPrimitive from "../svg-primitive.js";


class Morphology extends Primitive{
	constructor(){
		super();
		this.createInput("Input", 0);
		this.createOutput("Output", 0);
		this.nodeComponentClass = MorphologyNode;
		this.svgComponentClass = MorphologyPrimitive;

		this.operator = "erode";
		this.operators = ["erode", "dilate"];
		this.radius = 0;
	}
}

class MorphologyNode extends Node{
	constructor(){
		super();
		this.title = "Morphology";
		this._operatorChanged = this._operatorChanged.bind(this);
		this._radiusChanged = this._radiusChanged.bind(this);
	}

	renderEditor(){
		return <div className="vertical-list">
			<ComboBox value={this.props.primitive.operator} width={this.props.primitive.nodeWidth - 18}
				values={this.props.primitive.operators.map(op => {return {value: op, label: op}})} 
				label="operator:" onChange={this._operatorChanged}/>
			<div className="horizontalFields">
				<div className="field-section">
					<div className="field-label">radius:</div>
					<TextInput className="field" value={this.props.primitive.radius} onChange={this._radiusChanged} 
						validator={validators.isPositiveNumber} />
				</div>
			</div>
		</div>;
	}

	_update(){
		this.props.onUpdate();
		this.forceUpdate();
	}

	_operatorChanged(newOperator){
		this.props.primitive.operator = newOperator;
		this._update();
	}

	_radiusChanged(newRadius){
		this.props.primitive.radius = newRadius;
		this._update();
	}
}

class MorphologyPrimitive extends SVGPrimitive{
	render(){
		return <feMorphology operator={this.props.primitive.operator} radius={this.props.primitive.radius}
			in={this.getInput(0)} out={this.getOutput()} />
	}
}

module.exports = Morphology;