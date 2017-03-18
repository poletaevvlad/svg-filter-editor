import Primitive from "../primitive.js";
import Node from "../node-ui.js";
import SVGPrimitive from "../svg-primitive.js";


class Output extends Primitive{
	constructor(){
		super();
		this.createInput("Result",0);
		this.isRemovable = false;
		this.nodeComponentClass = OutputNode;
		this.svgComponentClass = null;
	}
}

class OutputNode extends Node{
	constructor(){
		super();
		this.title = "Output";
	}

	renderEditor(){
		return "Connect your nodes to the Result input";
	}
}


module.exports = Output;