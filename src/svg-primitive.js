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
		let otherPrimitive = this.props.filter.getPrimitive(input.connection.outputPrimitive);
		return otherPrimitive.getOutputName(input.connection.outputIOID);
	}

	getOutput(id){
		return this.props.primitive.getOutputName(id);
	}

}

module.exports = SVGPrimitive;