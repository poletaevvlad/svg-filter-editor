import React from 'react';
import { CustomPicker } from 'react-color';
import { Saturation, Hue } from "react-color/lib/components/common";

import TextInput from "./text-input.js";
import focused from "./focused.js";
import validators from "./validators.js";

class ColorPickerPointer extends React.PureComponent{
	render(){
		return <div className="pointer" />
	}
}

class ColorPicker extends React.PureComponent{
	constructor(){
		super();
		this._redChanged = this._redChanged.bind(this);
		this._greenChanged = this._greenChanged.bind(this);
		this._blueChanged = this._blueChanged.bind(this);
		this._hexChanged = this._hexChanged.bind(this);
	}

	render(){
		return <div className="color-picker">
			<div className="saturation" onMouseDown={focused}><Saturation {... this.props} onChange={this.props.onChange} /></div>
			<div className="hue" onMouseDown={focused}><Hue {... this.props} pointer={ColorPickerPointer} 
				onChange={this.props.onChange}/></div>
			<div className="color-preview" style={{backgroundColor: this.props.hex}}></div>
			<div className="rgb horizontalFields compact">
				<div className="field-section">
					<div className="field-label">rgb:</div>
					<TextInput className="field" value={this.props.rgb.r} onChange={this._redChanged} 
						validator={validators.isColorComponent} />
				</div>
				<div className="field-section">
					<TextInput className="field" value={this.props.rgb.g} onChange={this._greenChanged} 
						validator={validators.isColorComponent} />
				</div>
				<div className="field-section">
					<TextInput className="field" value={this.props.rgb.b} onChange={this._blueChanged} 
						validator={validators.isColorComponent} />
				</div>
			</div>
			<div className="hex horizontalFields compact">
				<div className="field-section">
					<div className="field-label">hex:</div>
					<TextInput className="field" value={this.props.hex.substr(1)} onChange={this._hexChanged} 
						validator={validators.isColorHex} />
				</div>
			</div>
		</div>
	}

	_redChanged(color){
		this.props.onChange({"r": parseInt(color), "g": this.props.rgb.g, "b": this.props.rgb.b, "a": 1});
	}

	_greenChanged(color){
		this.props.onChange({"r": this.props.rgb.r, "g": parseInt(color), "b": this.props.rgb.b, "a": 1});
	}

	_blueChanged(color){
		this.props.onChange({"r": this.props.rgb.r, "g": this.props.rgb.g, "b": parseInt(color), "a": 1});
	}

	_hexChanged(color){
		this.props.onChange({"hex": color});
	}
}

module.exports = CustomPicker(ColorPicker);