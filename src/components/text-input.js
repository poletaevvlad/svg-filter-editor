import React from "react";

import validators from "./validators.js"

class TextInput extends React.Component{
	constructor(props){
		super(props);
		this._handleChange = this._onChange.bind(this);
		this._handleBlur = this._onBlur.bind(this);
		this._handleFocus = this._onFocus.bind(this);

		this.state = {
			value: props.value,
			valid: true,
			focused: false
		}
	}

	render(){
		if (! this.state.focused){
			this.state.value = this.props.value;	
		}
		return <input className={this.props.className + (this.state.valid ? "" : " invalid")} 
			type="text" value={this.state.value} onChange={this._handleChange} onFocus={this._handleFocus} 
			onBlur={this._handleBlur}/>
	}

	_onChange(e){
		let valid = validators.VALID;
		if (typeof this.props.validator != "undefined"){
			valid = this.props.validator(e.target.value);
		}
		if (valid != validators.INVALID){
			this.setState({value: e.target.value, valid: valid == validators.VALID});
		}
		if (valid == validators.VALID && typeof this.props.onChange != "undefined"){
			this.props.onChange(e.target.value, e);
		}
	}

	_onBlur(e){
		if (this.state.valid){
			this._onChange(e);
		}
		
		this.setState({value: this.props.value, valid: true, focused: false});
	}

	_onFocus(e){
		this.state.focused = true;
		this.setState(this.state);
		
	}
}

module.exports = TextInput;