import React from "react";

class SVGPrimitive extends React.Component{

	render(){
		return "ERROR";
	}

	getInput(id){
		let input = this.props.primitive.getInput(id);
		if(input.connection == null){
			return undefined;
		}
		return `r${input.connection.outputPrimitive}-${input.connection.outputIOID}`;
	}

	getOutput(id){
		return `r${this.props.primitive.id}-${id}`;
	}

}

module.exports = SVGPrimitive;