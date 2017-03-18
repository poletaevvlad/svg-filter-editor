import Primitive from "../primitive.js";
import Node from "../node-ui.js";

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
	}

	renderEditor(){
		
	}
}

module.exports = Offset;