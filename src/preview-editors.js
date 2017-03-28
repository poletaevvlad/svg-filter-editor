import React from "react";

import ComboBox from "./components/combobox.js";
import ColorPicker from "./components/color-picker.js";
import Selector from "./components/selector.js";
import TextInput from "./components/text-input.js";
import validators from "./components/validators.js";
import focused from "./components/focused.js";


class BackgroundEditor extends React.Component{
	constructor(){
		super();
		this.types = [
			{value: "transparent", label: "Transparent"},
			{value: "color", label: "Solid color"},
			{value: "checkerboard", label: "Checkerboard"}
		]

		this.checkerboardTypes = [
			{value: "dark", "class": "checkerboard-dark"},
			{value: "light", "class": "checkerboard-light"},
			{value: "contrast", "class": "checkerboard-contrast"}
		]
	}

	render(){
		return <div className="vertical-list">
			<ComboBox value={this.props.type} width={200 - 18} values={this.types} 
				label="background type:" onChange={this.props.onTypeChange} />
			{ this.props.type == "color" ? 
				<div className="content">
					<ColorPicker color={this.props.color} onChange={this.props.onColorChanged}/>
				</div>
			: this.props.type == "checkerboard" ?
				<div className="content">
					<Selector values={this.checkerboardTypes} value={this.props.checkerboard} 
						onChange={this.props.onCheckerboardChanged}/>
				</div>
			: null
			}
		</div>
	}
}

class ShapeEditor extends React.Component{
	constructor(){
		super();
		this.shapes = [
			{value: "ellipse", label: "Ellipse"},
			{value: "rect", label: "Rectangle"},
			{value: "path", label: "Path"},
		]
	}

	render(){
		return <div className="vertical-list">
			<ComboBox value={this.props.shape} width={200 - 18} values={this.shapes} 
				label="shape:" onChange={this.props.onShapeChange} />
			{this.props.shape == "rect" || this.props.shape == "ellipse" ? 
				<div className="content horizontalFields">
					<div className="field-section">
						<div className="field-label">width:</div>
						<TextInput value={this.props.width} onChange={this.props.onWidthChange}
							validator={validators.isPositiveNumber}/>
					</div>
					<div className="field-section">
						<div className="field-label">height:</div>
						<TextInput value={this.props.height} onChange={this.props.onHeightChange}
							validator={validators.isPositiveNumber}/>
					</div>
				</div>
			: this.props.shape == "path" ? 
				<div className="content">
					<textarea rows="3" value={this.props.path} onChange={this.props.onPathChange}/>
				</div>
			: null}
			
			<div className="horizontalFields">
				<label className="section-name field-section noalign">
					<input type="checkbox" checked={this.props.fillEnabled} onChange={this.props.onFillEnabledChange} />
					<div className="field-label">Fill</div>
				</label>
			</div>
			{this.props.fillEnabled ? 
				<ColorPicker color={this.props.fillColor} onChange={this.props.onFillColorChange}/>
			: null}

			<div className="horizontalFields">
				<label className="section-name field-section noalign">
					<input type="checkbox" checked={this.props.strokeEnabled} onChange={this.props.onStrokeEnabledChange}/>
					<div className="field-label">Stroke</div>
				</label>
			</div>
			{this.props.strokeEnabled ? <div>
				<ColorPicker color={this.props.strokeColor} onChange={this.props.onStrokeColorChange}/>
				<div className="horizontalFields offset-top">
					<div className="field-section">
						<div className="field-label">stroke width:</div>
						<TextInput value={this.props.strokeWidth} onChange={this.props.onStrokeWidthChange}
						validator={validators.isNumber}/>
					</div>
				</div>
			</div> : null}
		</div>
	}
}

module.exports = {ShapeEditor: ShapeEditor, BackgroundEditor: BackgroundEditor}