import { generatorRuntime } from "babel-polyfill";

function* range(start, end){
	for (let i = start; i < end; i++){
		yield i
	}
}

function arrayRange(start, end){
	let array = []
	for (let i of range(start, end)){
		array.push(i);
	}
	return array;
}

module.exports = {
	range: range,
	arrayRange: arrayRange
}