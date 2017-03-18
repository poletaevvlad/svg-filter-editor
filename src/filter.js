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

	getOrderedPrimitives(){
		if (this.output.getInput(0).connection == null){
			return []
		}

		let primitives = this.primitives.slice();
		primitives.splice(primitives.indexOf(this.output), 1);
		let outputPrimitiveConnection = this.output.getInput(0).connection;
		let desiredResult = [`${outputPrimitiveConnection.outputPrimitive}-${outputPrimitiveConnection.outputIOID}`];
		let input = [];
		let result = [];
		var over = false;
		do{
			var found = false;
			for (var i = 0; i < primitives.length; i++){
				let j
				for (j = 0; j < primitives[i].inputs.length; j++){
					let inputIO = primitives[i].inputs[j];
					if (inputIO.connection != null){
						let connection = `${inputIO.connection.outputPrimitive}-${inputIO.connection.outputIOID}`;
						if (input.indexOf(connection) < 0){
							break;						
						}
					}
				}
				if (j == primitives[i].inputs.length){
					primitives[i].outputs.forEach(o => input.push(`${primitives[i].id}-${o.id}`))
					result.push(primitives[i]);
					primitives.splice(i, 1);
					found = true;
					break;
				}
			}

			over = true;
			for (let k = 0; k < desiredResult.length; k++){
				if (input.indexOf(desiredResult[k]) < 0){
					over = false;
					break;
				}
			}

			if (!over && !found){
				return null;
			}
		}while(! over);
		return result;
	}
}

module.exports = Filter;