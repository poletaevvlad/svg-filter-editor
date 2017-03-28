import React from "react";
import ReactSlider from "react-slider";

import Primitive from "../primitive.js";
import Node from "../node-ui.js";
import TextInput from "../components/text-input.js";
import validators from "../components/validators.js";
import ComboBox from "../components/combobox.js";
import ColorPicker from "../components/color-picker.js";


let OUTPUTS = [
	{name: "SourceGraphic", label: "Graphics"},
	{name: "SourceAlpha", label: "Alpha"},
]

class Input extends Primitive{
	constructor(){
		super();
		for (let i = 0; i < OUTPUTS.length; i++){
			this.createOutput(OUTPUTS[i].label, i);	
		}
		this.nodeComponentClass = InputNode;
 	}

 	getOutputName(id){
		return OUTPUTS[id].name;
	}

	getInputIndexByName(name){
		return OUTPUTS.findIndex(val => val.name == name);
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


module.exports = Input;