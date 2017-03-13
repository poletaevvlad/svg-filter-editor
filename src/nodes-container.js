import React from "react";

class NodesContainer extends React.Component{
	constructor(){
		super();
		this.state = {
			left: 0, 
			top: 0
		}

		this._handleMouseDown = this._onMouseDown.bind(this);
		this._handleMouseUp = this._onMouseUp.bind(this);
		this._handleMouseMove = this._onMouseMove.bind(this);

		this._mouseX = 0;
		this._mouseY = 0;
		this._isDragging = false;
	}

	render(){
		return <div id="nodes-container" 
				onMouseDown={this._handleMouseDown} 
				onMouseUp={this._handleMouseUp} 
				onMouseMove={this._handleMouseMove}>
			<div id="nodes-origin" style={{left: `${this.state.left}px`, top: `${this.state.top}px`}}>
				<div style={{
					position: "absolute",
					left: "10px",
					top: "10px",
					width: "50px",
					height: "50px",
					backgroundColor: "#5982AF"
				}}></div>
			</div>
		</div>
	}

	_onMouseDown(e){
		if(e.nativeEvent.button == 1){
			this._isDragging = true;
			this._mouseX = e.nativeEvent.clientX;
			this._mouseY = e.nativeEvent.clientY;
		}
	}

	_onMouseUp(e){
		this._isDragging = false;
	}

	_onMouseMove(e){
		if(this._isDragging){
			let dx = e.nativeEvent.clientX - this._mouseX;
			let dy = e.nativeEvent.clientY - this._mouseY;
			this.setState({
				left: this.state.left + dx,
				top: this.state.top + dy
			});
			this._mouseX = e.nativeEvent.clientX;
			this._mouseY = e.nativeEvent.clientY;
		}
	}
}

module.exports = NodesContainer;