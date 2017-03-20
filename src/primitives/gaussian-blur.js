import React from "react";

import Primitive from "../primitive.js";
import Node from "../node-ui.js";
import TextInput from "../components/text-input.js";
import validators from "../components/validators.js";
import SVGPrimitive from "../svg-primitive.js";


class GaussianBlur extends Primitive{
	constructor(){
		super();
		this.createInput("Input", 0);
		this.createOutput("Output", 0);
		this.nodeComponentClass = GaussianBlurNode;
		this.svgComponentClass = GaussianBlurPrimitive;
		
		this.stdDeviation = 5;
	}

	createInput(name, id){
		super.createInput(name, id);
	}
}

class GaussianBlurNode extends Node{
	constructor(){
		super();
		this.title = "Gaussian Blur";
		this.state = {};

		this._stdDeviationChanged = this._stdDeviationChanged.bind(this);
	}

	renderEditor(){
		return <div className="horizontalFields">
			<div className="field-section">
				<div className="field-label">std. deviation:</div>
				<TextInput className="field" value={this.props.primitive.stdDeviation} 
					onChange={this._stdDeviationChanged} validator={validators.isPositiveNumber} />
			</div>
		</div>
	}

	_stdDeviationChanged(newValue){
		this.props.primitive.stdDeviation = parseFloat(newValue.replace(",", "."));
		this.setState(this.state);
		this.props.onUpdate();
	}
}

class GaussianBlurPrimitive extends SVGPrimitive{
	render(){
		return <feGaussianBlur stdDeviation={this.props.primitive.stdDeviation} in={this.getInput(0)} result={this.getOutput(0)} />
	}
}

module.exports = GaussianBlur;