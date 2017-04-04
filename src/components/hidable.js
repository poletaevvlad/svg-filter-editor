import React from "react"

class Hidable extends React.PureComponent{
	constructor(props){
		super()
		this.state = {
			open: props.defaultShown
		}
	}

	render(){
		return <div className="hidable">
			<div className="title" onClick={() => this.setState({open: !this.state.open})}>
				<div className={"icon" + (this.state.open ? " open" : "")}/>
				{this.props.name}
			</div>
			{this.state.open ? 
				<div className="hidden-content">
					{this.props.children}
				</div>
			: null}
		</div>
	}
}

Hidable.defaultProps = {
	defaultShown: false,
	name: "Hidable"
}

module.exports = Hidable;