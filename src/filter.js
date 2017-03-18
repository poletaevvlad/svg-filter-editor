import Primitive from "./primitive.js"
import Output from "./primitives/output.js"

class Filter{

	constructor(){
		this.primitives = [],
		this.connections = []
		this.primitivesById = {}
		this.output = new Output();

		this.addPrimitive(this.output);
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

	removePrimitive(primitive){
		if (!primitive.isRemovable){
			return;
		}
		this.primitives.splice(this.primitives.indexOf(primitive), 1);
		delete this.primitivesById[primitive.id];
		this.connections = this.connections.filter(connection => {
			if (connection.inputPrimitive == primitive.id || connection.outputPrimitive == primitive.id){
				this.removeConnection(connection);
				return false;
			}
			return true;
		})
	}

}

module.exports = Filter;