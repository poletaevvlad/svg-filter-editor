import React from "react";
import NodesContainer from "./nodes-container.js"

class FilterEditor extends React.Component{
	render(){
		return <div id="app-root">
			<NodesContainer />
			<div id="result-preview">
				<div id="separator"></div>
				<div id="toolbar"></div>
			</div>
		</div>
	}
}

module.exports = FilterEditor;