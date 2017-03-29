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


class NodeSelector extends React.PureComponent{
	constructor(){
		super();
		this._selectPrimitive = this._onPrimitiveSelected.bind(this);
	}

	render(){
		return <div id="node-selector" style={{left: this._getX(), top: this._getY()}}>
			<div className="column">
				<div className="item" onClick={() => this._selectPrimitive(new Input())}>+ Input</div>
				<div className="section">Primitives</div>
				<div className="item" onClick={() => this._selectPrimitive(new Blend())}>+ Blend</div>
				<div className="item" onClick={() => this._selectPrimitive(new ColorMatrix())}>+ Color matrix</div>
				<div className="item">Component transfer</div>
				<div className="item" onClick={() => this._selectPrimitive(new Composite())}> +Composite</div>
				<div className="item">Convolve matrix</div>
				<div className="item" onClick={() => this._selectPrimitive(new Lighting())}>+ Difuse lighting</div>
				<div className="item">Displacement map</div>
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

	_getX = () => this.props.x + 10;
	_getY = () => this.props.y + 10;

	_onPrimitiveSelected(component){
		if (typeof this.props.onSelected != "undefined"){
			this.props.onSelected(component);
		}
	}
}

module.exports = NodeSelector;