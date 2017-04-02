import React from "react";

import Primitive from "../primitive.js";
import Node from "../node-ui.js";
import TextInput from "../components/text-input.js";
import validators from "../components/validators.js";
import SVGTag from "../svg-tag.js";


class GaussianBlur extends Primitive{
	constructor(){
		super();
		this.createInput("Input", 0);
		this.createOutput("Output", 0);
		this.nodeComponentClass = GaussianBlurNode;
		
		this.stdDeviation = 5;
	}

	createInput(name, id){
		super.createInput(name, id);
	}

	getSVG(){
		return this.svgTag("feGaussianBlur").input("in", 0).output("result", 0)
			.arg("stdDeviation", this.stdDeviation, "0");
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
		return <div className="horizontal">
			<div className="label">std. deviation:</div>
			<TextInput className="field" value={this.props.primitive.stdDeviation} 
				onChange={this._stdDeviationChanged} validator={validators.isPositiveNumber} />
		</div>
	}

	_stdDeviationChanged(newValue){
		this.props.primitive.stdDeviation = parseFloat(newValue.replace(",", "."));
		this.setState(this.state);
		this.props.onUpdate();
	}
}

module.exports = GaussianBlur;