import React from "react";
import ReactSlider from "react-slider";

import Primitive from "../primitive.js";
import Node from "../node-ui.js";
import TextInput from "../components/text-input.js";
import validators from "../components/validators.js";
import ComboBox from "../components/combobox.js";
import SVGPrimitive from "../svg-primitive.js";
import ColorPicker from "../components/color-picker.js";


class Input extends Primitive{
	constructor(){
		super();
		this.createOutput("Graphics", 0);
		this.createOutput("Alpha", 1);
		this.nodeComponentClass = InputNode;
		this.svgComponentClass = InputPrimitive;
 	}

 	getOutputName(id){
		return ["SourceGraphic", "SourceAlpha"][id];
	}
}

class InputNode extends Node{
	constructor(){
		super();
		this.title = "Input";
	}

	renderEditor(){
		return null
	}
}

class InputPrimitive extends SVGPrimitive{
	render(){
		return null;
	}
}

module.exports = Input;