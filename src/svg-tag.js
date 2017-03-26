class SVGTag{
	constructor(name, args){
		this.name = name;
		this.args = {}
		this.children = [];
		this.primitive = null;
	}

	arg(name, value, defaultValue){
		value = value.toString();
		if (defaultValue == null || value != defaultValue){
			this.args[name] = value;
		}
		return this
	}

	child(child){
		this.children.push(child);
		return this;
	}

	input(name, id){
		this.arg(name, this.primitive.getInputName(id), null);
		return this;
	}

	output(name, id){
		this.arg(name, this.primitive.getOutputName(id), null)
		return this;
	}
}

module.exports = SVGTag;