import React from "react";

import Offset from "./primitives/offset.js";
import GaussianBlur from "./primitives/gaussian-blur.js";
import Merge from "./primitives/merge.js";
import Blend from "./primitives/blend.js";
import Morphology from "./primitives/morphology.js";
import ColorMatrix from "./primitives/color-matrix.js";
import Flood from "./primitives/flood.js";
import Turbulence from "./primitives/turbulence.js";
import Lighting from "./primitives/lighting.js";
import Input from "./primitives/input.js";
import Composite from "./primitives/composite.js";
import ConvolveMatrix from "./primitives/convolve-matrix.js";
import ComponentTransfer from "./primitives/component-transfer.js";
import DisplacementMap from "./primitives/displacement-map.js";

class NodeSelector extends React.PureComponent{
	constructor(props){
		super();
		this._selectPrimitive = this._onPrimitiveSelected.bind(this);
		this.state = {
			x: props.x + 5,
			y: props.y + 5
		}
	}

	componentDidMount(){
		let rect = this.refs.root.getBoundingClientRect();
		let containerRect = document.getElementById("nodes-container").getBoundingClientRect();
		let x = this.state.x;
		let y = this.state.y;
		if (x < 5){
			x = 5;
		}else if (x > containerRect.width - rect.width - 5){
			x = containerRect.width - rect.width - 5;
		}

		if (y < 5){
			y = 5;
		}else if (y > containerRect.height - rect.height - 5){
			y = containerRect.height - rect.height - 5;
		}
		this.setState({x: x, y: y});
	}

	render(){
		return <div ref="root" id="node-selector" style={{left: this.state.x, top: this.state.y}}>
			<div className="column">
				<div className="item" onClick={() => this._selectPrimitive(new Input())}>+ Input</div>
				<div className="section">Primitives</div>
				<div className="item" onClick={() => this._selectPrimitive(new Blend())}>+ Blend</div>
				<div className="item" onClick={() => this._selectPrimitive(new ColorMatrix())}>+ Color matrix</div>
				<div className="item" onClick={() => this._selectPrimitive(new ComponentTransfer())}>+ Component transfer</div>
				<div className="item" onClick={() => this._selectPrimitive(new Composite())}> +Composite</div>
				<div className="item" onClick={() => this._selectPrimitive(new ConvolveMatrix())}>+ Convolve matrix</div>
				<div className="item" onClick={() => this._selectPrimitive(new Lighting())}>+ Difuse lighting</div>
				<div className="item" onClick={() => this._selectPrimitive(new DisplacementMap())}>+ Displacement map</div>
				<div className="item" onClick={() => this._selectPrimitive(new Flood())}>+ Flood</div>
			</div>
			<div className="column">
				<div className="item" onClick={() => this._selectPrimitive(new GaussianBlur())}>+ Gaussian blur</div>
				<div className="item">Image</div>
				<div className="item" onClick={() => this._selectPrimitive(new Merge())}>+ Merge</div>
				<div className="item" onClick={() => this._selectPrimitive(new Morphology())}>+ Morphology</div>
				<div className="item" onClick={() => this._selectPrimitive(new Offset())}>+ Offset</div>
				<div className="item">Specular lighting</div>
				<div className="item">Tile</div>
				<div className="item" onClick={() => this._selectPrimitive(new Turbulence())}>+ Turbulence</div>
			</div>
		</div>
	}

	_onPrimitiveSelected(component){
		if (typeof this.props.onSelected != "undefined"){
			this.props.onSelected(component);
		}
	}
}

module.exports = NodeSelector;