import React from "react";

import Primitive from "../primitive.js";
import Node from "../node-ui.js";
import TextInput from "../components/text-input.js";
import validators from "../components/validators.js";
import SVGPrimitive from "../svg-primitive.js";


class Offset extends Primitive{
	constructor(){
		super();
		this.createInput("Input", 0);
		this.createOutput("Output", 0);
		this.nodeComponentClass = OffsetNode;
		this.svgComponentClass = OffsetPrimitive;
		this.x = 0;
		this.y = 0;
	}
}

class OffsetNode extends Node{
	constructor(){
		super();
		this.title = "Offset";
		this.state = {};

		this._xChanged = this._xChanged.bind(this);
		this._yChanged = this._yChanged.bind(this);
	}

	renderEditor(){
		return <div className="horizontalFields">
			<div className="field-section">
				<div className="field-label">x:</div>
				<TextInput className="field" value={this.props.primitive.x} onChange={this._xChanged} 
					validator={validators.isNumber} />
			</div>
			<div className="field-section">
				<div className="field-label">y:</div>
				<TextInput className="field" value={this.props.primitive.y} onChange={this._yChanged}
					validator={validators.isNumber} />
			</div>
		</div>
	}

	_parse(val){
		return parseFloat(val.replace(",", "."));
	}

	_xChanged(newValue){
		this.props.primitive.x = this._parse(newValue);
		this.setState(this.state);
		this.props.onUpdate();
	}

	_yChanged(newValue){
		this.props.primitive.y = this._parse(newValue);
		this.setState(this.state);
		this.props.onUpdate();
	}
}

class OffsetPrimitive extends SVGPrimitive{
	render(){
		return <feOffset dx={this.props.primitive.x} dy={this.props.primitive.y} 
			in={this.getInput(0)} result={this.getOutput(0)} />
	}
}

module.exports = Offset;