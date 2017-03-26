import React from "react";
import ReactSlider from "react-slider";

import Primitive from "../primitive.js";
import Node from "../node-ui.js";
import TextInput from "../components/text-input.js";
import validators from "../components/validators.js";
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
		this._colorChanged = this._colorChanged.bind(this);
		this._alphaChanged = this._alphaChanged.bind(this);
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
		focused(this);
		this.props.primitive.alpha = e;
		this._update();	
	}

}


module.exports = Flood;