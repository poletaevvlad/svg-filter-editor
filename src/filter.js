import Primitive from "./primitive.js"
import Output from "./primitives/output.js"

import Connection from "./connection.js";

let RESERVED_INPUT = ["SourceGraphic", "SourceAlpha"];

class Filter{

	constructor(){
		this.primitives = [],
		this.connections = []
		this.primitivesById = {}
		this.output = new Output();

		this.addPrimitive(this.output);
	}

	_notifyConnectionChange(connection){
		if (connection.inputPrimitive != null){
			let primitive = this.getPrimitive(connection.inputPrimitive);
			if (typeof primitive != "undefined"){
				primitive.onConnectionsChanged();
			}
		}
		if (connection.outputPrimitive != null){
			let primitive = this.getPrimitive(connection.outputPrimitive);
			if (typeof primitive != "undefined"){
				primitive.onConnectionsChanged();
			}
		}
	}

	addConnection(connection){
		this.connections.push(connection);
		let inputPrimitive = this.getPrimitive(connection.inputPrimitive);
		let io = inputPrimitive.getInput(connection.inputIOID);
		if (io.connection != null){
			this.removeConnection(io.connection);
		}
		io.connection = connection;
		this._notifyConnectionChange(connection);
	}

	dettachConnection(primitive, inputIO){
		let inputPrimitive = this.getPrimitive(primitive);
		let io = inputPrimitive.getInput(inputIO);
		if (io && io.connection != null){
			let connection = io.connection;
			this.removeConnection(connection, false);
			io.connection = null;
			this._notifyConnectionChange(connection);
			return connection;
		}
		return null;
	}

	removeConnection(connection, notify, del){
		let index = this.connections.indexOf(connection);
		if (index < 0) return;
		if (typeof del == "undefined" || del){
			this.connections.splice(index, 1);
		}

		let primitive = this.getPrimitive(connection.inputPrimitive);
		if (typeof primitive != "undefined"){
			primitive.getInput(connection.inputIOID).connection = null;
		}
		if (typeof notify == "undefined" || notify){
			this._notifyConnectionChange(connection);
		}
	}

	addPrimitive(primitive){
		this.primitives.push(primitive);
		primitive.filter = this;
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
				this.removeConnection(connection, true, false);
				return false;
			}
			return true;
		});
	}

	getOrderedPrimitives(){
		let outputName = this.output.getInputName(0)
		if (RESERVED_INPUT.indexOf(outputName) >= 0){
			class PassthroughOutput extends Primitive{
				getSVG = () => this.svgTag("feMerge").child(this.svgTag("feMergeNode").arg("in", outputName, null));
			}
			return [new PassthroughOutput()];
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

	pushToFront(nodes){
		// let removable = [];
		// let offset = 0;
		// let i = 0;
		// for(; i < this.primitives.length; i++){
		// 	if (nodes.indexOf(this.primitives[i]) >= 0){
		// 		removable.push(this.primitives[i]);
		// 		offset++;
		// 	}else{
		// 		this.primitives[i - offset] = this.primitives[i];
		// 	}
		// }
		// for (let j = 0; j < removable.length; j++){
		// 	this.primitives[i + j] = removable[j];
		// }
	}
}

module.exports = Filter;