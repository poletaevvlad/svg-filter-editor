import Primitive from "./primitive.js"

class Filter{

	constructor(){
		this.primitives = [],
		this.connections = []
		this.primitivesById = {}

		// to be removed
		this.addPrimitive(new Primitive());
		this.addPrimitive(new Primitive());
		this.primitives[1].positionX += 250;
		this.primitives[1].positionY += 150;
	}

	addConnection(connection){
		this.connections.push(connection);
		let inputPrimitive = this.getPrimitive(connection.inputPrimitive);
		let io = inputPrimitive.getInput(connection.inputIOID);
		if (io.connection != null){
			this.removeConnection(io.connection);
		}
		io.connection = connection;
	}

	dettachConnection(primitive, inputIO){
		let inputPrimitive = this.getPrimitive(primitive);
		let io = inputPrimitive.getInput(inputIO);
		if (io && io.connection != null){
			let connection = io.connection;
			this.removeConnection(connection);
			io.connection = null;
			return connection;
		}
		return null;
	}

	removeConnection(connection){
		let index = this.connections.indexOf(connection);
		if (index < 0) return;
		this.connections.splice(index, 1);
	}

	addPrimitive(primitive){
		this.primitives.push(primitive);
		this.primitivesById[primitive.id] = primitive;
	}

	getPrimitive(id){
		return this.primitivesById[id];
	}

}

module.exports = Filter;