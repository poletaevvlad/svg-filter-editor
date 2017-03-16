import Primitive from "./primitive.js"

class Filter{

	constructor(){
		this.primitives = [new Primitive(), new Primitive()],
		this.connections = []
	}

	addConnection(connection){
		this.connections.push(connection);
	}

}

module.exports = Filter;