class Connection{

	constructor(outPrimitive, outIo, inPrimitive, inIo){
		this.id = ++Connection.lastId;
		this.outputPrimitive = outPrimitive;
		this.outputIOID = outIo;
		this.inputPrimitive = inPrimitive;
		this.inputIOID = inIo;
	}

}
Connection.lastId = 0;

module.exports = Connection;