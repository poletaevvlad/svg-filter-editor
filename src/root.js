import React from "react";

import NodesContainer from "./nodes-container.js";
import Preview from "./preview.js";
import Filter from "./filter.js";
import ComboBox from "./components/combobox.js";
import ColorPicker from "./components/color-picker.js";
import Selector from "./components/selector.js";


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
			editing: "none"
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
					bgColor={this.state.bgColor} bgCheckerboard={this.state.bgCheckerboard} />
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
				NOT YET IMPLEMENTED
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