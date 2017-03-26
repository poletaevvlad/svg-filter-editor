import React from "react";

class CodeDisplay extends React.Component{
	render(){
		let lineIndex = 1;
		let primitives = this.props.filter.getOrderedPrimitives();
		let lines = [];
		primitives.forEach(primitive => this.makeLine(lines, primitive.getSVG(), 0));
		return <div id="code">
			<div className="line-numbers" />
			<div id="code-lines">
				{lines.map(line =>{
					return <div key={lineIndex} className="line">
						<div className="line-number">{lineIndex++}</div>
						{line}
					</div>
				})}
			</div>
		</div>;
	}

	makeLine(lines, tag, offset){
		if (tag == null){
			return;
		}

		let args = []
		for (let arg in tag.args){
			args.push(<span key={arg}>{arg}=&quot;{tag.args[arg]}&quot;</span>);
		}

		lines.push(<div key={lines.length} className="code">
			{"\u{A0}".repeat(offset)}&lt;{tag.name} {args}{tag.children.length == 0 ? " /": null}&gt;
		</div>);
		tag.children.forEach(child => this.makeLine(lines, child, offset + 2));
		if (tag.children.length > 0){
			lines.push(<div key={lines.length} className="code">{"&nbsp;".repeat(offset)}&lt;/{tag.name}&gt;</div>);
		}
	}
}

module.exports = CodeDisplay;