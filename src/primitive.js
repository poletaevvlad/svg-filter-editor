import Node from "./node-ui.js"

var lastId = 0;
function generateId(){
	return ++lastId;
}

function input(title, id){
	return {title: title, id: id};
}

function output(title, id){
	return {title: title, id: id};
}

class Primitive{
	constructor(){
		this.id = generateId();

		this.inputs = [input("Input 1", 1), input("Input 2", 2)];
		this.outputs = [output("Output 1", 1), output("Output 2", 2), output("Output 3", 3)];

		this.positionX = 50;
		this.positionY = 40;

		this.nodeComponentClass = Node;
	}

	getInputId(inp){
		return `pr${this.id}_in${inp.id}`;
	}

	getOutputId(out){
		return `pr${this.id}_out${out.id}`;
	}
}

module.exports = Primitive;