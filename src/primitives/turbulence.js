import React from "react";

import Primitive from "../primitive.js";
import Node from "../node-ui.js";
import TextInput from "../components/text-input.js";
import validators from "../components/validators.js";
import ComboBox from "../components/combobox.js";
import SVGPrimitive from "../svg-primitive.js";


class Turbulence extends Primitive{
	constructor(){
		super();
		this.createOutput("Output", 0);
		this.nodeComponentClass = TurbulenceNode;
		this.svgComponentClass = TurbulencePrimitive;
		
		this.type = "turbulence";
		this.types = ["fractalNoise", "turbulence"];

		this.baseFrequencyX = 0;
		this.baseFrequencyY = 0;
		this.numOctaves = 1;
		this.seed = 0;
		this.stitchTiles = false;
	}

	createInput(name, id){
		super.createInput(name, id);
	}
}

class TurbulenceNode extends Node{
	constructor(){
		super();
		this.title = "Turbulence";
		this.state = {};

		this._typeChanged = this._typeChanged.bind(this);
		this._baseFrequencyXChanged = this._baseFrequencyXChanged.bind(this);
		this._baseFrequencyYChanged = this._baseFrequencyYChanged.bind(this);
		this._numOctavesChanged = this._numOctavesChanged.bind(this);
		this._seedChanged = this._seedChanged.bind(this);
		this._stitchTilesChanged = this._stitchTilesChanged.bind(this);
	}

	renderEditor(){
		return <div className="vertical-list">
			<ComboBox value={this.props.primitive.type} width={this.props.primitive.nodeWidth - 18}
				values={this.props.primitive.types.map(type => {return {value: type, label: type}})} 
				label="type:" onChange={this._typeChanged}/>
			<div className="horizontalFields">
				<div className="field-section">
					<div className="field-label">base freq.:</div>
					<TextInput className="field" value={this.props.primitive.baseFrequencyX} 
						onChange={this._baseFrequencyXChanged} validator={validators.isPositiveNumber} />
					<div className="field-label"></div>
					<TextInput className="field" value={this.props.primitive.baseFrequencyY} 
						onChange={this._baseFrequencyYChanged} validator={validators.isPositiveNumber} />
				</div>
			</div>

			<div className="horizontalFields">
				<div className="field-section">
					<div className="field-label">num octaves:</div>
					<TextInput className="field" value={this.props.primitive.numOctaves} 
						onChange={this._numOctavesChanged} validator={validators.isPositiveNumber} />
				</div>
			</div>

			<div className="horizontalFields">
				<div className="field-section">
					<div className="field-label">seed:</div>
					<TextInput className="field" value={this.props.primitive.seed} 
						onChange={this._seedChanged} validator={validators.isPositiveNumber} />
				</div>
			</div>

			<div className="horizontalFields">
				<label className="field-section noalign">
					<input type="checkbox" checked={this.props.primitive.stitchTiles} 
						onChange={this._stitchTilesChanged}/> 
					<div className="field-label">stitch tiles</div>
				</label>
			</div>
		</div>
	}

	_update(){
		this.setState(this.state);
		this.props.onUpdate();
	}

	_typeChanged(newValue){
		this.props.primitive.type = newValue;
		this._update();
	}

	_baseFrequencyXChanged(newValue){
		this.props.primitive.baseFrequencyX = parseFloat(newValue.replace(",", "."));
		this._update();
	}

	_baseFrequencyYChanged(newValue){
		this.props.primitive.baseFrequencyY = parseFloat(newValue.replace(",", "."));
		this._update();
	}

	_numOctavesChanged(newValue){
		this.props.primitive.numOctaves = parseInt(newValue);
		this._update();
	}

	_seedChanged(newValue){
		this.props.primitive.seed = parseFloat(newValue.replace(",", "."));
		this._update();
	}

	_stitchTilesChanged(e){
		this.props.primitive.stitchTiles = e.target.checked;
		this._update();
	}
}

class TurbulencePrimitive extends SVGPrimitive{
	render(){
		return <feTurbulence type={this.props.primitive.type} result={this.getOutput(0)}
			baseFrequency={`${this.props.primitive.baseFrequencyX} ${this.props.primitive.baseFrequencyY}`}  
			numOctaves={this.props.primitive.numOctaves} seed={this.props.primitive.seed}
			stitchTiles={this.props.primitive.stitchTiles ? "stitch" : "noStitch"} />
	}
}

module.exports = Turbulence;