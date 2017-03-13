import React from "react";

class FilterEditor extends React.Component{
	render(){
		return <div id="app-root">
			<div id="nodes-container"></div>
			<div id="result-preview">
				<div id="separator"></div>
				<div id="toolbar"></div>
			</div>
		</div>
	}
}

module.exports = FilterEditor;