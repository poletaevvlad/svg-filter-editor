import React from "react";

import NodesContainer from "./nodes-container.js";
import Preview from "./preview.js";
import Filter from "./filter.js";

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
			previewWidth: 400
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
				<div id="toolbar"></div>
				<Preview filter={this.filter} />
			</div>
		</div>
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