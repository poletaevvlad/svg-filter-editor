import Node from "./node-ui.js"

var lastId = 0;
function generateId(){
	return ++lastId;
}

class Primitive{
	constructor(){
		this.id = generateId();

		this.positionX = 50;
		this.positionY = 40;

		this.nodeComponentClass = Node;
	}
}

module.exports = Primitive;