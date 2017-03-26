import React from "react";

class Preview extends React.Component{
	render(){
		let primitives = this.props.filter.getOrderedPrimitives();
		if (primitives == null){
			return <div>ERROR</div>;
		}else{
			let i = 0;
			return <svg id="preview-root">
				<defs>
					<pattern id="checkerboard" patternUnits="userSpaceOnUse" width="18" height="18" 
						className={"checkerboard " + this.props.bgCheckerboard}>
						<rect className="light" x="0" y="0" width="18" height="18" />
						<rect className="dark" x="0" y="0" width="9" height="9" />
						<rect className="dark" x="9" y="9" width="9" height="9" />
					</pattern>
					<filter id="filter" width="1000" height="1000" x="-500" y="-500">
						{primitives.map(primitive => this._getSVGComponent(primitive.getSVG(), i++))}
					</filter>
				</defs>
				<rect x="0" y="0" width="100%" height="100%" {... this._getBackground()} />
				<g filter="url(#filter)">
					{this._getShape()}
				</g>
			</svg>
		}
	}

	_getSVGComponent(svgTag, key){
		if (svgTag == null){
			return null;
		}else{
			if (typeof key != "undefined"){
				svgTag.arg("key", key);
			}
			let i = 0;
			return React.createElement(svgTag.name, svgTag.args,
					svgTag.children.map(tag => this._getSVGComponent(tag, i++)));
		}
	}

	componentDidMount(){
		window.addEventListener("resize", this.componentDidUpdate.bind(this));
	}

	_getShape(){
		let args = {}
		if (this.props.fillEnabled){
			args["fill"] = this.props.fillColor;
		}else{
			args["fill"] = "transparent";
		}
		if (this.props.strokeEnabled){
			args["stroke"] = this.props.strokeColor;
			args["strokeWidth"] = this.props.strokeWidth;
		}
		switch(this.props.shapeType){
			case "ellipse":
				return <ellipse rx={this.props.shapeWidth / 2} ry={this.props.shapeHeight / 2} cx="50%" cy="50%" {... args} />
			case "rect":
				return <rect x="50%" y="50%" height={this.props.shapeHeight} width={this.props.shapeWidth} 
					transform={`translate(${-this.props.shapeWidth / 2 |0}.5 ${-this.props.shapeHeight / 2 |0}.5)`} {... args}/>
			case "path":
				return <path ref="path" d={this.props.path} {... args} />
			default:
				return <circle fill="orange" r="30" cx="50%" cy="50%" />
		}
	}

	componentDidUpdate(){
		if (this.props.shapeType == "path"){
			let path = this.refs.path;
			let bbox = path.getBoundingClientRect();

			let parent = document.getElementById("preview-root");
			let parentBbox = parent.getBoundingClientRect();
		
			let x = ((parentBbox.right - parentBbox.left) - (bbox.right - bbox.left)) / 2;
			let y = ((parentBbox.bottom - parentBbox.top) - (bbox.bottom - bbox.top)) / 2;
			path.setAttribute("transform", `translate(${x} ${y})`);
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