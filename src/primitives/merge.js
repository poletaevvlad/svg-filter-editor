import React from "react";

import Primitive from "../primitive.js";
import Node from "../node-ui.js";
import TextInput from "../components/text-input.js";
import validators from "../components/validators.js";
import SVGPrimitive from "../svg-primitive.js";


class Merge extends Primitive{
	constructor(){
		super();
		this.createInput("Input 1", 0);
		this.createOutput("Output", 0);
		this.nodeComponentClass = MergeNode;
		this.svgComponentClass = MergePrimitive;
	}

	onConnectionsChanged(){
		let inputsCount = this.inputs.length;
		while (inputsCount > 0 && this.inputs[inputsCount - 1].connection == null){
			inputsCount--;
		}
		inputsCount++;
		if (inputsCount < this.inputs.length){
			this.inputs.splice(inputsCount, this.inputs.length - inputsCount);
		} else while (inputsCount > this.inputs.length){
			this.createInput(`Input ${this.inputs.length + 1}`, this.inputs.length);
		}
	}
}

class MergeNode extends Node{
	constructor(){
		super();
		this.title = "Merge";
	}

	renderEditor(){
		return null;
	}
}

class MergePrimitive extends SVGPrimitive{
	render(){
		let nodes = [];
		for (let i = 0; i < this.props.primitive.inputs.length - 1; i++){
			let connection = this.getInput(this.props.primitive.inputs[i].id);
			if (typeof connection != "undefined"){
				nodes.push(<feMergeNode key={i} in={connection} />);
			}
		}
		return <feMerge result={this.getOutput(0)}>
		{nodes}
		</feMerge>
	}
}

module.exports = Merge;