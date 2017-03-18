import Node from "./node-ui.js"
import SVGPrimitive from "./svg-primitive.js"

var lastId = 0;
function generateId(){
	return ++lastId;
}

function input(title, id){
	return {title: title, id: id, connection: null};
}

function output(title, id){
	return {title: title, id: id};
}

class Primitive{
	constructor(){
		this.id = generateId();

		this.isRemovable = true;
		this.inputs = [];
		this.outputs = [];

		this.positionX = 50;
		this.positionY = 40;
		this.nodeWidth = 150;

		this.nodeComponentClass = Node;
		this.svgComponentClass = SVGPrimitive;
	}

	createInput(name, id){
		this.inputs.push(input(name, id));
	}

	createOutput(name, id){
		this.outputs.push(output(name, id));
	}

	getInputId(inp){
		return `pr${this.id}_in${inp.id}`;
	}

	getOutputId(out){
		return `pr${this.id}_out${out.id}`;
	}

	getInput(id){
		return this.inputs.find(e => e.id == id);
	}

	getOutput(id){
		return this.outputs.find(e => e.id == id);
	}
}

Primitive.getInputId = (primitive, ioId) => `pr${primitive}_in${ioId}`
Primitive.getOutputId = (primitive, ioId) => `pr${primitive}_out${ioId}`

module.exports = Primitive;