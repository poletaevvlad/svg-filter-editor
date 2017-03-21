import React from "react";
import ReactSlider from "react-slider";

import Primitive from "../primitive.js";
import Node from "../node-ui.js";
import TextInput from "../components/text-input.js";
import validators from "../components/validators.js";
import ComboBox from "../components/combobox.js";
import SVGPrimitive from "../svg-primitive.js";
import ColorPicker from "../components/color-picker.js";


class Flood extends Primitive{
	constructor(){
		super();
		this.createOutput("Output", 0);
		this.nodeComponentClass = FloodNode;
		this.svgComponentClass = FloodPrimitive;

		this.color = "orange";
		this.alpha = 1;
	}
}

class FloodNode extends Node{
	constructor(){
		super();
		this.title = "Flood";
		this._colorChanged = this._colorChanged.bind(this);
	}

	renderEditor(){
		return <div className="vertical-list">
			
			<ColorPicker color={this.props.primitive.color} onChange={this._colorChanged} />
			<div className="horizontalFields">
				<div className="field-section">
					<div className="field-label" style={{marginRight: "0"}}>&alpha;:</div>
					<div className="field-label">
						<ReactSlider max={1000} value={this.props.primitive.alpha * 1000} 
							onChange={e => this._alphaChanged(e / 1000)}/>
					</div>
					<TextInput className="field" value={this.props.primitive.alpha} 
						onChange={this._alphaChanged} validator={validators.isNumber01} />
				</div>
			</div>
		</div>;
	}

	_update(){
		this.props.onUpdate();
		this.forceUpdate();
	}

	_colorChanged(e){
		this.props.primitive.color = e.hex;
		this._update();
	}

	_alphaChanged(e){
		this.props.primitive.alpha = e;
		this._update();	
	}

}

class FloodPrimitive extends SVGPrimitive{
	render(){
		return <feFlood floodColor={this.props.primitive.color} floodOpacity={this.props.primitive.alpha} 
			result={this.getOutput(0)} />
	}
}

module.exports = Flood;