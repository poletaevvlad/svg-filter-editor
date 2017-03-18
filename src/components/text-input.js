import React from "react";

class TextInput extends React.Component{
	constructor(props){
		super(props);
		this._handleChange = this._onChange.bind(this);
		this._handleBlur = this._onBlur.bind(this);

		this.state = {
			value: props.value,
			valid: true
		}
	}

	render(){
		return <input className={this.props.className + (this.state.valid ? "" : " invalid")} 
			type="text" value={this.state.value} onChange={this._handleChange} onBlur={this._handleBlur}/>
	}

	_onChange(e){
		let valid = true;
		if (typeof this.props.validator != "undefined"){
			valid = this.props.validator(e.target.value);
		}
		this.setState({value: e.target.value, valid: valid});
		if (valid && typeof this.props.onChange != "undefined"){
			this.props.onChange(e.target.value);
		}
	}

	_onBlur(e){
		this._onChange(e);
		if (!this.state.valid){
			this.setState({value: this.props.value, valid: true});
		}
	}
}

module.exports = TextInput;