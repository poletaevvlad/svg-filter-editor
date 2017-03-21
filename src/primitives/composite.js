import React from "react";

import Primitive from "../primitive.js";
import Node from "../node-ui.js";
import TextInput from "../components/text-input.js";
import validators from "../components/validators.js";
import ComboBox from "../components/combobox.js";
import SVGPrimitive from "../svg-primitive.js";


class Composite extends Primitive{
	constructor(){
		super();
		this.createInput("Input 1", 0);
		this.createInput("Input 2", 1);
		this.createOutput("Output", 0);
		this.nodeComponentClass = CompositeNode;
		this.svgComponentClass = CompositePrimitive;

		this.operator = "over";
		this.operators = ["over", "in", "out", "atop", "xor", "arithmetic"];
		this.k1 = 0;
		this.k2 = 0;
		this.k3 = 0;
		this.k4 = 0;
	}
}

class CompositeNode extends Node{
	constructor(){
		super();
		this.title = "Composite";
	}

	renderEditor(){
		return <div className="vertical-list">
			<ComboBox value={this.props.primitive.operator} width={this.props.primitive.nodeWidth - 18}
				values={this.props.primitive.operators.map(op => {return {value: op, label: op}})} 
				label="operator:" onChange={(val) => {this.props.primitive.operator = val; this._update();}} />
			{this.props.primitive.operator == "arithmetic" ? 
				<div className="horizontalFields">
					<div className="field-section">
						<TextInput className="field" value={this.props.primitive.k1} validator={validators.isNumber}
							onChange={(val) => {this.props.primitive.k1 = this._parse(val); this._update()}} />
						<div className="field-label"></div>
						<TextInput className="field" value={this.props.primitive.k2} validator={validators.isNumber}
							onChange={(val) => {this.props.primitive.k2 = this._parse(val); this._update()}} />
						<div className="field-label"></div>
						<TextInput className="field" value={this.props.primitive.k3} validator={validators.isNumber}
							onChange={(val) => {this.props.primitive.k3 = this._parse(val); this._update()}} />
						<div className="field-label"></div>
						<TextInput className="field" value={this.props.primitive.k4} validator={validators.isNumber}
							onChange={(val) => {this.props.primitive.k4 = this._parse(val); this._update()}} />
					</div>
				</div>
			: null}
		</div>;
	}

	_parse(val){
		return parseFloat(val.replace(',', '.'));
	}

	_update(){
		this.props.onUpdate();
		this.forceUpdate();
	}
}

class CompositePrimitive extends SVGPrimitive{
	render(){
		return <feComposite operator={this.props.primitive.operator} 
			{... this.props.primitive.operator == "arithmetic" ? {k1: this.props.primitive.k1, 
				k2: this.props.primitive.k2, k3: this.props.primitive.k3, k4: this.props.primitive.k4}: {null}}
			in={this.getInput(0)} in2={this.getInput(1)} result={this.getOutput(0)} />
	}
}

module.exports = Composite;