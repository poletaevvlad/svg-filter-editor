import React from "react";

import Primitive from "../primitive.js";
import Node from "../node-ui.js";
import TextInput from "../components/text-input.js";
import validators from "../components/validators.js";

class Offset extends Primitive{
	constructor(){
		super();
		this.createInput("Input", 0);
		this.createOutput("Output", 0);
		this.nodeComponentClass = OffsetNode;
		this.x = 0;
		this.y = 0;
	}
}

class OffsetNode extends Node{
	constructor(){
		super();
		this.title = "Offset";
	
		this._xChanged = this._xChanged.bind(this);
		this._yChanged = this._yChanged.bind(this);
	}

	renderEditor(){
		return <div className="horizontalFields">
			<div className="field-section">
				<div className="field-label">x:</div>
				<TextInput className="field" value={this.props.primitive.x} onChange={this._xChanged} 
					validator={validators.isNumber} />
			</div>
			<div className="field-section">
				<div className="field-label">y:</div>
				<TextInput className="field" value={this.props.primitive.y} onChange={this._yChanged}
					validator={validators.isNumber} />
			</div>
		</div>
	}

	_xChanged(newValue){
		this.props.primitive.x = parseInt(newValue);
		this.setState(this.state);
	}

	_yChanged(newValue){
		this.props.primitive.y = parseInt(newValue);
		this.setState(this.state);
	}
}

module.exports = Offset;