import React from "react";

class Preview extends React.Component{
	render(){
		let primitives = this.props.filter.getOrderedPrimitives();
		if (primitives == null){
			return <div>ERROR</div>;
		}else{
			return <svg id="preview-root">
				<defs>
					<filter id="filter" width="1000" height="1000" x="-500" y="-500">
						{primitives.map(primitive => {
							let PrimitiveComponent = primitive.svgComponentClass;
							return <PrimitiveComponent primitive={primitive} filter={this.props.filter} 
								key={primitive.id} />
						})}
					</filter>
				</defs>
				<g filter="url(#filter)">
					<circle fill="orange" r="30" cx="50%" cy="50%" />
				</g>
			</svg>
		}
	}
}

module.exports = Preview;