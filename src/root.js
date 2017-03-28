import React from "react";

import NodesContainer from "./nodes-container.js";
import Preview from "./preview.js";
import Filter from "./filter.js";
import CodeDisplay from "./code-display.js";

import { BackgroundEditor, ShapeEditor } from "./preview-editors.js";

const MIN_PREVIEW_WIDTH = 212;

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
			editing: "none",
			shapeType: "ellipse",
			shapeWidth: 60,
			shapeHeight: 60,
			fillEnabled: true,
			fillColor: "#FFFFFF",
			strokeEnabled: false,
			strokeColor: "#000000",
			strokeWidth: 1,
			path: "M0 0 H100 V50 H0 Z"
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
					<div className={"section" + (this.state.editing == "code" ? " active" : "")} onClick={() => this._toggleEditor("code")}>Show code</div>
					<div className={"section" + (this.state.editing == "shape" ? " active" : "")} onClick={() => this._toggleEditor("shape")}>Shape</div>
					<div className={"section" + (this.state.editing == "background" ? " active" : "")} onClick={() => this._toggleEditor("background")}>Background</div>
				</div>
				{this._renderEditor()}
				{this.state.editing == "code" ? 
				<CodeDisplay filter={this.filter}/> :
				<Preview filter={this.filter} bgType={this.state.bgType} 
					bgColor={this.state.bgColor} bgCheckerboard={this.state.bgCheckerboard}
					shapeType={this.state.shapeType} shapeWidth={this.state.shapeWidth} shapeHeight={this.state.shapeHeight}
					fillEnabled={this.state.fillEnabled} fillColor={this.state.fillColor} strokeEnabled={this.state.strokeEnabled}
					strokeColor={this.state.strokeColor} strokeWidth={this.state.strokeWidth} path={this.state.path} />
				}
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
					path={this.state.path}
					onPathChange={val => this.setState({path: val.trget.value})}
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
			this.setState({previewWidth: Math.max(this.state.previewWidth - dx, MIN_PREVIEW_WIDTH)});
			this._separatorX = e.clientX;
		}
	}

	_onUpdate(){
		this.forceUpdate();
	}
}

module.exports = FilterEditor;