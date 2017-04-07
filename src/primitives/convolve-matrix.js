import React from "react";
import ReactSlider from "react-slider";

import Primitive from "../primitive.js";
import Node from "../node-ui.js";
import TextInput from "../components/text-input.js";
import converters from "../components/converters.js";
import validators from "../components/validators.js";
import ComboBox from "../components/combobox.js";
import SVGTag from "../svg-tag.js";
import { arrayRange } from "../utils.js";
import Hidable from "../components/hidable.js";


class ConvolveMatrix extends Primitive{
	constructor(){
		super();
		this.createInput("Input", 0);
		this.createOutput("Output", 0);
		this.nodeComponentClass = ConvolveMatrixNode;

		this.orderX = 3;
		this.orderY = 3;
		this.kernelMatrix = [[0, 0, 0], [0, 1, 0], [0, 0, 0]];
		this.divisorActive = false;
		this.divisor = 1;

		this.bias = 0;
		this.targetX = 1;
		this.targetY = 1;

		this.edgeMode = "duplicate";
		this.edgeModes = ["duplicate", "wrap", "none"];
		this.preserveAlpha = false;
	}

	updateMatrixShape(){
		while (this.orderY < this.kernelMatrix.length){
			this.kernelMatrix.pop();
		}
		while (this.orderY > this.kernelMatrix.length){
			let array = [];
			for (let i = 0; i < this.orderX; i++){
				array.push(0);
			}
			this.kernelMatrix.push(array);
		}

		for (let i = 0; i < this.kernelMatrix.length; i++){
			while (this.orderX < this.kernelMatrix[i].length){
				this.kernelMatrix[i].pop()
			}	
			while(this.orderX > this.kernelMatrix[i].length){
				this.kernelMatrix[i].push(0);
			}
		}
	}

	onPropertyValueChanged(propertyName, oldValue, newValue){
		if (propertyName == "orderX"){
			this.updateMatrixShape();
			if (this.targetX >= newValue){
				this.targetX = newValue - 1;
			}
		} else if (propertyName == "orderY"){
			this.updateMatrixShape();
			if (this.targetY >= newValue){
				this.targetY = newValue - 1;
			}
		} else if (propertyName == "divisorActive" && !newValue){
			this.divisor = this.getDefaultDivisor();
		}
	}

	getSVG(){
		let tag = this.svgTag("feConvolveMatrix")
			.input("in", 0).output("result", 0)
			.arg("order", `${this.orderX} ${this.orderY}`, "3 3")
			.arg("kernelMatrix", this.makeMatrix(this.kernelMatrix), null)
			.arg("bias", this.bias, "0")
			.arg("targetX", this.targetX, null)
			.arg("targetY", this.targetY, null)
			.arg("edgeMode", this.edgeMode, "duplicate")
			.arg("preserveAlpha", this.preserveAlpha, "false");
		if (this.divisorActive){
			tag.arg("divisor", this.divisor, null)
		}
		return tag;
	}

	getDefaultDivisor(){
		let value = 0;
		for (let i = 0; i < this.kernelMatrix.length; i++){
			for (let j = 0; j < this.kernelMatrix[i].length; j++){
				value += this.kernelMatrix[i][j];
			}
		}
		return value;
	}

	onArrayElementChanged(propertyName, index, oldValue, newValue){
		if (propertyName == "kernelMatrix" && ! this.divisorActive){
			this.divisor = this.getDefaultDivisor();
		}
	}
}

class ConvolveMatrixNode extends Node{
	constructor(){
		super();
		this.title = "Convolve matrix";
	}

	renderEditor(){
		return <div className="vertical">
			<div className="horizontal">
				<div className="label">order:</div>
				<TextInput className="field" value={this.props.primitive.orderX} onChange={this.valSetter("orderX")} 
					validator={validators.isPositiveInteger} converter={converters.int} />
				<TextInput className="field" value={this.props.primitive.orderY} onChange={this.valSetter("orderY")} 
					validator={validators.isPositiveInteger} converter={converters.int}/>
			</div>
			{arrayRange(0, this.props.primitive.orderY).map(i => 
				<div className="horizontal" key={i}>
					{arrayRange(0, this.props.primitive.orderX).map(j => 
						<TextInput className="field" value={this.props.primitive.kernelMatrix[i][j]} 
							onChange={this.valArraySetter("kernelMatrix", [i, j])} 
							validator={validators.isNumber} converter={converters.float} key={j}/>
					)}
				</div>
			)}

			<div className="section-name">target:</div>
			<div className="horizontal">
				<div className="label">x:</div>
				<ReactSlider max={this.props.primitive.orderX - 1} value={this.props.primitive.targetX} onChange={this.valSetter("targetX")}/>
				<TextInput value={this.props.primitive.targetX} onChange={this.valSetter("targetX")} converter={converters.int}
					validator={validators.range(validators.isPositiveInteger, 0, this.props.primitive.orderX - 1)}  />
			</div>

			<div className="horizontal">
				<div className="label">y:</div>
				<ReactSlider max={this.props.primitive.orderY - 1} value={this.props.primitive.targetY} onChange={this.valSetter("targetY")}/>
				<TextInput value={this.props.primitive.targetY} onChange={this.valSetter("targetY")} converter={converters.int}
					validator={validators.range(validators.isPositiveInteger, 0, this.props.primitive.orderY - 1)}  />
			</div>

			<Hidable name="Details">
				<div className="vertical">
					<div className="horizontal align-middle">
						<input type="checkbox" checked={this.props.primitive.divisorActive} onChange={e => this.valSetter("divisorActive")(e.target.checked)}/>
						<div className="label">divisor:</div>
						<TextInput value={this.props.primitive.divisor} onChange={this.valSetter("divisor")} 
							enabled={this.props.primitive.divisorActive} validator={validators.isNumber} converter={converters.float} />
					</div>

					<div className="horizontal">
						<div className="label">bias:</div>
						<TextInput value={this.props.primitive.bias} onChange={this.valSetter("bias")} 
							validator={validators.isNumber} converter={converters.float} />
					</div>

					<ComboBox value={this.props.primitive.edgeMode} width={this.props.primitive.nodeWidth - 18}
						values={this.props.primitive.edgeModes.map(op => {return {value: op, label: op}})} 
						label="edge mode:" onChange={this.valSetter("edgeMode")} />

					<label className="horizontal align-middle">
						<input type="checkbox" checked={this.props.primitive.preserveAlpha} onChange={e => this.valSetter("preserveAlpha")(e.target.checked)}/>
						<div className="label">preserve alpha</div>
					</label>
				</div>
			</Hidable>
		</div>
	}
}

module.exports = ConvolveMatrix;