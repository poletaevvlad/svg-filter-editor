import React from "react";

class Node extends React.Component{
	
	constructor(){
		super()
		this.title = "undefined";
		this._renderEditor = this.renderEditor.bind(this);

		this._handleDragMouseDown = this._onDragMouseDown.bind(this);
	}

	render(){
		return <div className="node" style={{left: `${this.props.left}px`, top: `${this.props.top}px`}}>
			<div className="header" onMouseDown={this._handleDragMouseDown}>{this.title}</div>
		</div>
	}

	renderEditor(){
		return <b>renderEditor() must be overriden</b>
	}

	_onDragMouseDown(e){
		if (e.nativeEvent.button == 0){
			e.preventDefault();
			if (typeof this.props.onEnterDraggingState != "undefined"){
				this.props.onEnterDraggingState(this.props.primitive);
			}
		}
	}
}

module.exports = Node;