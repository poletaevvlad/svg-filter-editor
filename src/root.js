import React from "react";

import NodesContainer from "./nodes-container.js";
import Preview from "./preview.js";
import Filter from "./filter.js";

class FilterEditor extends React.Component{
	constructor(){
		super();
		this.filter = new Filter();
	}

	render(){
		return <div id="app-root">
			<NodesContainer filter={this.filter} />
			<div id="result-preview">
				<div id="separator"></div>
				<div id="toolbar"></div>
				<Preview filter={this.filter} />
			</div>
		</div>
	}
}

module.exports = FilterEditor;