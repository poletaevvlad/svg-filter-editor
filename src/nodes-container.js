import React from "react";
import Node from "./node-ui.js"
import Primitive from "./primitive.js"
import Connection from "./connection.js"

class ConnectionGraphics extends React.Component{
	render(){
		let path = this.generatePath();
		return <g>
			<path d={path} stroke="black" strokeWidth="5" fill="transparent" />
			<path d={path} stroke="white" strokeWidth="3" fill="transparent" />
		</g>
	}

	generatePath(){
		let x1 = this.props.x1, y1 = this.props.y1;
		let x2 = this.props.x2, y2 = this.props.y2;
		let offset1 = this.props.d1 == "input" ? -20: 20, offset2 = this.props.d2 == "input" ? -20: 20;
		return `M ${x1} ${y1} L ${x1 + offset1} ${y1} L ${x2 + offset2} ${y2} L ${x2} ${y2}`;
	}
}

class NodesContainer extends React.Component{
	constructor(){
		super();
		this.state = {
			left: 0, 
			top: 0,
			primitives: [new Primitive(), new Primitive()],
			connections: []
		}

		this._handleMouseDown = this._onMouseDown.bind(this);
		this._handleMouseUp = this._onMouseUp.bind(this);
		this._handleMouseMove = this._onMouseMove.bind(this);

		this._mouseX = 0;
		this._mouseY = 0;
		this._isPanning = false;
		this._isDragging = false;
		this._isConnecting = false;
		this._connectionStart = null;
		this._connectionEnd = null;
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
						left={primitive.positionX} top={primitive.positionY} key={primitive.id} primitive={primitive}
						dragging={this._isDragging && this.selected.findIndex(val => primitive.id == val.id) >= 0} 
						{... (this._isConnecting && this._connectionEnd != null && this._connectionEnd.primitive == primitive.id) ? 
							{ ioSelectionType: this._connectionEnd.type, ioSelectionId: this._connectionEnd.io } : {} }/>
				})}
			</div>
			<svg id="nodes-connections" width="100%" height="100%">
				{this.state.connections.map(connection => {
					let inputPosition = this.getElementCenter(Primitive.getInputId(connection.inputPrimitive, connection.inputIOID));
					let outputPosition = this.getElementCenter(Primitive.getOutputId(connection.outputPrimitive, connection.outputIOID));
					return <ConnectionGraphics x1={inputPosition.x} y1={inputPosition.y} d1="input" 
						x2 = {outputPosition.x} y2={outputPosition.y} d2="output" key={connection.id} />
				})}
				{this._isConnecting ? 
					<ConnectionGraphics x1={this._connectionStart.position.x} y1={this._connectionStart.position.y} 
						x2={this._connectionEnd != null ? this._connectionEnd.position.x : this._mouseX} 
						y2={this._connectionEnd != null ? this._connectionEnd.position.y : this._mouseY} 
						d1={this._connectionStart.type} d2={this._connectionStart.type == "input" ? "output" : "input"}/>
				 : null}
			</svg>
		</div>
	}

	getElementCenter(id){
		let element = document.getElementById(id);
		let bbox = element.getBoundingClientRect();
		return {x: (bbox.left + bbox.right) / 2, y: bbox.top + bbox.height / 2}
	}

	_onMouseDown(e){
		if(e.nativeEvent.button == 1){
			this._isPanning = true;
		}else if (e.nativeEvent.button == 0){
			let element = e.target;
			if (element.hasAttribute("data-iotype")){
				this._isConnecting = true;
				this._connectionStart = {
					type: element.getAttribute("data-iotype"),
					primitive: parseInt(element.getAttribute("data-primitiveid")),
					io: parseInt(element.getAttribute("data-ioid")),
					position: this.getElementCenter(element.id)
				}
				this.setState(this.state);
			}
		}
		this._mouseX = e.nativeEvent.clientX;
		this._mouseY = e.nativeEvent.clientY;
	}

	_onMouseUp(e){
		this._isPanning = false;
		this._isDragging = false;
		if (this._isConnecting){
			this._isConnecting = false;
			if (this._connectionStart != null && this._connectionEnd != null){
				let input, output;
				if (this._connectionStart.type == "input"){
					input = this._connectionStart;
					output = this._connectionEnd;
				}else{
					input = this._connectionEnd;
					output = this._connectionStart;
				}
				let connection = new Connection(output.primitive, output.io, input.primitive, input.io);
				this.state.connections.push(connection);
			}
			this._connectionStart = null;
			this._connectionEnd = null;
		}
		this.setState(this.state);
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
		}else if (this._isConnecting){
			let element = e.target;
			if (element.hasAttribute("data-iotype")){
				this._connectionEnd = {
					type: element.getAttribute("data-iotype"),
					primitive: parseInt(element.getAttribute("data-primitiveid")),
					io: parseInt(element.getAttribute("data-ioid")),
					position: this.getElementCenter(element.id)
				}
			}else{
				this._connectionEnd = null;
			}
			this.setState(this.state);
		}
		this._mouseX = e.nativeEvent.clientX;
		this._mouseY = e.nativeEvent.clientY;
	}

	_onStartedNodeDragging(node){
		this.selected = [node];
		this._isDragging = true;
		this.setState(this.state);
	}
}

module.exports = NodesContainer;