import React from "react";

import Primitive from "../primitive.js";
import Node from "../node-ui.js";
import TextInput from "../components/text-input.js";
import validators from "../components/validators.js";
import converters from "../components/converters.js";
import ComboBox from "../components/combobox.js";
import CheckBox from "../components/checkbox.js";
import SVGTag from "../svg-tag.js";

class Turbulence extends Primitive{
	constructor(){
		super();
		this.createOutput("Output", 0);
		this.nodeComponentClass = TurbulenceNode;

		this.type = "turbulence";
		this.types = ["fractalNoise", "turbulence"];
		this.baseFrequencyX = 0.1;
		this.baseFrequencyY = 0.1;
		this.numOctaves = 2;
		this.seed = 1;
		this.stitchTiles = false;
	}

	createInput(name, id){
		super.createInput(name, id);
	}

	getSVG(){
		return this.svgTag("feTurbulence").
			arg("type", this.type, "turbulence")
			.arg("baseFrequency", `${this.baseFrequencyX} ${this.baseFrequencyY}`, "0 0")
			.arg("numOctaves", this.numOctaves, "1")
			.arg("seed", this.seed, "0")
			.arg("stitchTiles", this.stitchTiles ? "stitch" : "noStitch", "noStitch")
			.output("result", 0)
	}
}

class TurbulenceNode extends Node{
	constructor(){
		super();
		this.title = "Turbulence";
		this.state = {};
	}

	renderEditor(){
		return <div className="vertical">
			<ComboBox value={this.props.primitive.type} width={this.props.primitive.nodeWidth - 18}
				values={this.props.primitive.types.map(type => {return {value: type, label: type}})} 
				label="type:" onChange={this.valSetter("type")}/>
			<div className="horizontal">
				<div className="label">base freq.:</div>
				<TextInput className="field" value={this.props.primitive.baseFrequencyX} converter={converters.float}
					onChange={this.valSetter("baseFrequencyX")} validator={validators.isPositiveNumber} />
				<TextInput className="field" value={this.props.primitive.baseFrequencyY} converter={converters.float}
					onChange={this.valSetter("baseFrequencyY")} validator={validators.isPositiveNumber} />
			</div>

			<div className="horizontal">
				<div className="label">num octaves:</div>
				<TextInput className="field" value={this.props.primitive.numOctaves} converter={converters.int}
					onChange={this.valSetter("numOctaves")} validator={validators.isPositiveInteger} />
			</div>

			<div className="horizontal">
				<div className="label">seed:</div>
				<TextInput className="field" value={this.props.primitive.seed} converter={converters.int}
					onChange={this.valSetter("seed")} validator={validators.isPositiveInteger} />
			</div>

			<label className="horizontal align-middle">
				<CheckBox checked={this.props.primitive.stitchTiles} onChange={e => this.valSetter("stitchTiles")(e.target.checked)}/> 
				<div className="label">stitch tiles</div>
			</label>
		</div>
	}
}

module.exports = Turbulence;