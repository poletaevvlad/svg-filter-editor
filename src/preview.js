import React from "react";

class Preview extends React.Component{
	render(){
		return <svg id="preview-root">
			<defs>
				<filter id="filter" width="1000" height="1000" x="-500" y="-500">
					<feGaussianBlur stdDeviation="10" />
				</filter>
			</defs>
			<circle fill="orange" filter="url(#filter)" r="30" cx="50%" cy="50%" />
		</svg>
	}
}

module.exports = Preview;