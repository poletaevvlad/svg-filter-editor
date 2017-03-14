import React from "react";
import Node from "./node-ui.js"
import Primitive from "./primitive.js"

class NodesContainer extends React.Component{
	constructor(){
		super();
		this.state = {
			left: 0, 
			top: 0,
			primitives: [new Primitive(), new Primitive()]
		}

		this._handleMouseDown = this._onMouseDown.bind(this);
		this._handleMouseUp = this._onMouseUp.bind(this);
		this._handleMouseMove = this._onMouseMove.bind(this);

		this._mouseX = 0;
		this._mouseY = 0;
		this._isPanning = false;
		this._isDragging = false;
		this._handleNodeEnderDraggingState = this._onStartedNodeDragging.bind(this);

		this.selected = [];
	}

	render(){
		return <div id="nodes-container" 
				onMouseDown={this._handleMouseDown} 
				onMouseUp={this._handleMouseUp} 
				onMouseMove={this._handleMouseMove}>
			<div id="nodes-origin" style={{left: `${this.state.left}px`, top: `${this.state.top}px`}}>
				{this.state.primitives.map(primitive => {
					let NodeComponent = primitive.nodeComponentClass;
					return <NodeComponent onEnterDraggingState={this._handleNodeEnderDraggingState} 
						left={primitive.positionX} top={primitive.positionY} key={primitive.id} primitive={primitive}/>
				})}
			</div>
		</div>
	}

	_onMouseDown(e){
		if(e.nativeEvent.button == 1){
			this._isPanning = true;
		}
		this._mouseX = e.nativeEvent.clientX;
		this._mouseY = e.nativeEvent.clientY;
	}

	_onMouseUp(e){
		this._isPanning = false;
		this._isDragging = false;
	}

	_onMouseMove(e){
		let dx = e.nativeEvent.clientX - this._mouseX;
		let dy = e.nativeEvent.clientY - this._mouseY;
		if(this._isPanning){
			this.setState({
				left: this.state.left + dx,
				top: this.state.top + dy
			});
		}else if (this._isDragging){
			this.selected.forEach(primitive => {
				primitive.positionX += dx;
				primitive.positionY += dy;
			});
			this.setState(this.state);
		}
		this._mouseX = e.nativeEvent.clientX;
		this._mouseY = e.nativeEvent.clientY;
	}

	_onStartedNodeDragging(node){
		this.selected = [node];
		this._isDragging = true;
	}
}

module.exports = NodesContainer;