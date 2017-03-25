import React from "react";

import NodesContainer from "./nodes-container.js";
import Preview from "./preview.js";
import Filter from "./filter.js";
import ComboBox from "./components/combobox.js";
import ColorPicker from "./components/color-picker.js";
import Selector from "./components/selector.js";
import TextInput from "./components/text-input.js";
import validators from "./components/validators.js";


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
		return <div>
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
			<div className="content horizontalFields">
				<div className="field-section">
					<div className="field-label">width:</div>
					<TextInput value={this.props.width} onChange={this.props.onWidthChange}
						validator={validators.isNumber}/>
				</div>
				<div className="field-section">
					<div className="field-label">height:</div>
					<TextInput value={this.props.height} onChange={this.props.onHeightChange}
						validator={validators.isNumber}/>
				</div>
			</div>

			<div className="horizontalFields">
				<label className="section-name field-section noalign">
					<input type="checkbox" checked={this.props.fillEnabled} onChange={this.props.onFillEnabledChange} />
					<div className="field-label">Fill</div>
				</label>
			</div>
			<ColorPicker color={this.props.fillColor} onChange={this.props.onFillColorChange}/>
			<div className="horizontalFields">
				<label className="section-name field-section noalign">
					<input type="checkbox" checked={this.props.strokeEnabled} onChange={this.props.onStrokeEnabledChange}/>
					<div className="field-label">Stroke</div>
				</label>
			</div>
			<ColorPicker color={this.props.strokeColor} onChange={this.props.onStrokeColorChange}/>

			<div className="horizontalFields">
				<div className="field-section">
					<div className="field-label">stroke width:</div>
					<TextInput value={this.props.strokeWidth} onChange={this.props.onStrokeWidthChange}
					validator={validators.isNumber}/>
				</div>
			</div>
		</div>
	}
}

class FilterEditor extends React.Component{
	constructor(){
		super();
		this.filter = new Filter();
		this._handleUpdate = this._onUpdate.bind(this);
		this._separatorMouseUp = this._separatorMouseUp.bind(this);
		this._separatorMouseDown = this._separatorMouseDown.bind(this);
		this._separatorMouseMove = this._separatorMouseMove.bind(this);

		this._separatorDragging = false;
		this._separatorX = 0;

		this.state = {
			previewWidth: 400,
			bgType: "checkerboard",
			bgColor: "black",
			bgCheckerboard: "dark",
			editing: "shape",
			shapeType: "ellipse",
			shapeWidth: 30,
			shapeHeight: 30,
			fillEnabled: true,
			fillColor: "#FFA500",
			strokeEnabled: true,
			strokeColor: "#000000",
			strokeWidth: 1
		}

	}

	componentWillMount(){
		document.addEventListener("mousemove", this._separatorMouseMove);
		document.addEventListener("mouseup", this._separatorMouseUp);
	}

	componentWillUnmount(){
		document.removeEventListener("mousemove", this._separatorMouseMove);
		document.removeEventListener("mouseup", this._separatorMouseUp);
	}

	render(){
		return <div id="app-root">
			<NodesContainer filter={this.filter} onUpdate={this._handleUpdate} right={this.state.previewWidth} />
			<div id="result-preview" style={{width: `${this.state.previewWidth}px`}}>
				<div id="separator" onMouseDown={this._separatorMouseDown}></div>
				<div id="toolbar">
					<div className={"section" + (this.state.editing == "shape" ? " active" : "")} onClick={() => this._toggleEditor("shape")}>Shape</div>
					<div className={"section" + (this.state.editing == "background" ? " active" : "")} onClick={() => this._toggleEditor("background")}>Background</div>
				</div>
				{this._renderEditor()}
				<Preview filter={this.filter} bgType={this.state.bgType} 
					bgColor={this.state.bgColor} bgCheckerboard={this.state.bgCheckerboard}
					shapeType={this.state.shapeType} shapeWidth={this.state.shapeWidth} shapeHeight={this.state.shapeHeight}
					fillEnabled={this.state.fillEnabled} fillColor={this.state.fillColor} strokeEnabled={this.state.strokeEnabled}
					strokeColor={this.state.strokeColor} strokeWidth={this.state.strokeWidth} />
			</div>
		</div>
	}

	_renderEditor(){
		if (this.state.editing == "background"){
			return <div id="preview-editor">
				<BackgroundEditor type={this.state.bgType} color={this.state.bgColor}
					width={this.state.previewWidth} checkerboard={this.state.bgCheckerboard}
					onTypeChange={val => this.setState({bgType: val})} 
					onColorChanged={val => this.setState({bgColor: val.hex})}
					onCheckerboardChanged={val => this.setState({bgCheckerboard: val})} />
			</div>
		}
		if (this.state.editing == "shape"){
			return <div id="preview-editor">
				<ShapeEditor shape={this.state.shapeType} 
					onShapeChange={val => this.setState({shapeType: val})}
					width={this.state.shapeWidth} 
					onWidthChange={val => this.setState({shapeWidth: parseFloat(val.replace(",", "."))})}
					height={this.state.shapeHeight} 
					onHeightChange={val => this.setState({shapeHeight: parseFloat(val.replace(",", "."))})}
					strokeEnabled={this.state.strokeEnabled} 
					onStrokeEnabledChange={val => this.setState({strokeEnabled: val.target.checked})}
					fillEnabled={this.state.fillEnabled} 
					onFillEnabledChange={val => this.setState({fillEnabled: val.target.checked})}
					fillColor={this.state.fillColor}
					onFillColorChange={val => this.setState({fillColor: val.hex})}
					strokeColor={this.state.strokeColor}
					onStrokeColorChange={val => this.setState({strokeColor: val.hex})}
					strokeWidth={this.state.strokeWidth}
					onStrokeWidthChange={val => this.setState({strokeWidth: parseFloat(val.replace(",", "."))})}
					/>
			</div>	
		}
		return null;
	}

	_toggleEditor(editing){
		if (this.state.editing == editing){
			this.setState({"editing": "none"});
		}else{
			this.setState({"editing": editing});
		}
	}

	_separatorMouseDown(e){
		this._separatorDragging = true;
		this._separatorX = e.nativeEvent.clientX;
	}

	_separatorMouseUp(e){
		this._separatorDragging = false;
	}

	_separatorMouseMove(e){
		if (this._separatorDragging){
			let dx = e.clientX - this._separatorX;
			this.setState({previewWidth: this.state.previewWidth - dx});
			this._separatorX = e.clientX;
		}
	}

	_onUpdate(){
		this.forceUpdate();
	}
}

module.exports = FilterEditor;