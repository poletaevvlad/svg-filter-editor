import React from "react";

import Primitive from "../primitive.js";
import Node from "../node-ui.js";
import SVGTag from "../svg-tag.js";
import ComboBox from "../components/combobox.js";

class Blend extends Primitive{
	constructor(){
		super();
		this.createInput("Input 1", 0);
		this.createInput("Input 2", 1);
		this.createOutput("Output", 0);
		this.nodeComponentClass = BlendNode;

		this.mode = "normal";
		this.modes = ["normal", "multiply", "screen", "darken", "lighten"];
	}

	getSVG(){
		return this.svgTag("feBlend").arg("mode", this.mode, null)
			.input("in", 0).input("in2", 1).output("result", 0);
	}
}

class BlendNode extends Node{
	constructor(){
		super();
		this.title = "Blend";
		this._modeChanged = this._modeChanged.bind(this);
	}

	renderEditor(){
		return <ComboBox value={this.props.primitive.mode} width={this.props.primitive.nodeWidth - 18}
			values={this.props.primitive.modes.map(mode => {return {value: mode, label: mode}})} label="mode:" 
			onChange={this._modeChanged}/>
	}

	_modeChanged(newMode){
		this.props.primitive.mode = newMode;
		this.props.onUpdate();
		this.forceUpdate();
	}
}

module.exports = Blend;