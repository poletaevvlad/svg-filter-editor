import React from "react";
import ReactSlider from "react-slider";

import Primitive from "../primitive.js";
import Node from "../node-ui.js";
import TextInput from "../components/text-input.js";
import validators from "../components/validators.js";
import converters from "../components/converters.js";
import ComboBox from "../components/combobox.js";
import SVGTag from "../svg-tag.js";
import ColorPicker from "../components/color-picker.js";
import focused from "../components/focused.js";

class Flood extends Primitive{
	constructor(){
		super();
		this.createOutput("Output", 0);
		this.nodeComponentClass = FloodNode;

		this.color = "orange";
		this.alpha = 1;
	}

	getSVG(){
		return this.svgTag("feFlood").output("result", 0)
			.arg("floodColor", this.color, null)
			.arg("floodOpacity", this.alpha ,null);
	}
}

class FloodNode extends Node{
	constructor(){
		super();
		this.title = "Flood";
	}

	renderEditor(){
		return <div className="vertical">
			<ColorPicker color={this.props.primitive.color} onChange={val => this.valSetter("color")(val.hex)} />
			<div className="horizontal">
				<div className="label">&alpha;:</div>
				<ReactSlider max={1000} value={this.props.primitive.alpha * 1000} 
					onChange={e => this.valSetter("alpha")(e / 1000)}/>
				<TextInput className="field" value={this.props.primitive.alpha} 
					onChange={this.valSetter("alpha")} validator={validators.isNumber01}
					converter={converters.float} />
			</div>
		</div>;
	}
}


module.exports = Flood;