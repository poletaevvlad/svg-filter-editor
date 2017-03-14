import React from "react";

class Node extends React.Component{
	
	constructor(){
		super()
		this.title = "undefined";
		this._renderEditor = this.renderEditor.bind(this);

		this.state = {
			left: 50, 
			top: 40
		}

		this._handleDragMouseDown = this._onDragMouseDown.bind(this);
		this._handleDragMouseUp = this._onDragMouseUp.bind(this);
		this._handleDragMouseMove = this._onDragMouseMove.bind(this);
	}

	render(){
		return <div className="node" style={{left: `${this.state.left}px`, top: `${this.state.top}px`}}>
			<div className="header" onMouseDown={this._handleDragMouseDown} onMouseUp={this._handleDragMouseUp} 
				onMouseMove={this._handleDragMouseMove}>{this.title}</div>
		</div>
	}

	renderEditor(){
		return <b>renderEditor() must be overriden</b>
	}

	_onDragMouseDown(e){
	
	}

	_onDragMouseUp(e){

	}

	_onDragMouseMove(e){

	}
}

module.exports = Node;