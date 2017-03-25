import React from "react";

class Preview extends React.Component{
	render(){
		let primitives = this.props.filter.getOrderedPrimitives();
		if (primitives == null){
			return <div>ERROR</div>;
		}else{
			return <svg id="preview-root">
				<defs>
					<pattern id="checkerboard" patternUnits="userSpaceOnUse" width="18" height="18" className={"checkerboard " + this.props.bgCheckerboard}>
						<rect className="light" x="0" y="0" width="18" height="18" />
						<rect className="dark" x="0" y="0" width="9" height="9" />
						<rect className="dark" x="9" y="9" width="9" height="9" />
					</pattern>
					<filter id="filter" width="1000" height="1000" x="-500" y="-500">
						{primitives.map(primitive => {
							let PrimitiveComponent = primitive.svgComponentClass;
							return <PrimitiveComponent primitive={primitive} filter={this.props.filter} 
								key={primitive.id} />
						})}
					</filter>
				</defs>
				<rect x="0" y="0" width="100%" height="100%" {... this._getBackground()} />
				<g filter="url(#filter)">
					<circle fill="orange" r="30" cx="50%" cy="50%" />
				</g>
			</svg>
		}
	}

	_getBackground(){
		switch(this.props.bgType){
			case "transparent": 
				return {fill: "transparent"}
			case "color":
				return {fill: this.props.bgColor}
			case "checkerboard":
				return {fill: "url(#checkerboard)"}
		}
		return {};
	}
}

module.exports = Preview;