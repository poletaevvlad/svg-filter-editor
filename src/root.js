import React from "react";

import NodesContainer from "./nodes-container.js";
import Preview from "./preview.js";
import Filter from "./filter.js";

class FilterEditor extends React.Component{
	constructor(){
		super();
		this.filter = new Filter();
		this._handleUpdate = this._onUpdate.bind(this);
	}

	render(){
		return <div id="app-root">
			<NodesContainer filter={this.filter} onUpdate={this._handleUpdate} />
			<div id="result-preview">
				<div id="separator"></div>
				<div id="toolbar"></div>
				<Preview filter={this.filter} />
			</div>
		</div>
	}

	_onUpdate(){
		this.forceUpdate();
	}
}

module.exports = FilterEditor;