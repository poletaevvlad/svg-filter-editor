import React from "react";
import shallowCompare from "react-addons-shallow-compare";

class Node extends React.Component {
  constructor() {
    super();
    this.title = "undefined";
    this._renderEditor = this.renderEditor.bind(this);
    this._handleDragMouseDown = this._onDragMouseDown.bind(this);

    this.valSetter = (name) => {
      let setter = (value) => {
        let props = {};
        props[name] = value;
        this.setPrimitiveProps(props);
        this.props.onUpdate();
      };
      return setter.bind(this);
    };

    this.valArraySetter = (name, index) => {
      let setter = (value) => {
        this.setPrimitiveArrayValue(name, index, value);
        this.props.onUpdate();
      };
      return setter.bind(this);
    };
  }

  componentWillUpdate() {
    this.props.primitive.changed = false;
  }

  render() {
    return (
      <div
        className={"node" + (this.props.selected ? " selected" : "")}
        data-primitiveid={this.props.primitive.id}
        style={{ width: `${this.props.primitive.nodeWidth}px` }}
      >
        <div
          className={"header" + (this.props.dragging ? " dragging" : "")}
          onMouseDown={this._handleDragMouseDown}
        >
          {this.title}
        </div>
        <div className="io">
          {this.props.primitive.inputs.length == 0 ? null : (
            <div className="inputs">
              {this.props.primitive.inputs.map((input) => {
                return (
                  <div
                    className="io-component"
                    key={this.props.primitive.getInputId(input)}
                  >
                    {input.title}
                    <div
                      className={this._getConnectorClass(input.id, "input")}
                      id={this.props.primitive.getInputId(input)}
                      data-primitiveid={this.props.primitive.id}
                      data-iotype="input"
                      data-ioid={input.id}
                    />
                  </div>
                );
              })}
            </div>
          )}
          {this.props.primitive.outputs.length == 0 ? null : (
            <div className="outputs">
              {this.props.primitive.outputs.map((output) => {
                return (
                  <div
                    className="io-component"
                    key={this.props.primitive.getOutputId(output)}
                  >
                    {output.title}
                    <div
                      className={this._getConnectorClass(output.id, "output")}
                      id={this.props.primitive.getOutputId(output)}
                      data-primitiveid={this.props.primitive.id}
                      data-iotype="output"
                      data-ioid={output.id}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="content">{this.renderEditor()}</div>
      </div>
    );
  }

  _getConnectorClass(id, type) {
    let result = "io-connector";
    if (this.props.ioSelectionType == type && this.props.ioSelectionId == id) {
      result += " selected";
    }
    return result;
  }

  renderEditor() {
    return <b>renderEditor() must be overriden</b>;
  }

  _onDragMouseDown(e) {
    if (e.nativeEvent.button == 0) {
      e.preventDefault();
      if (typeof this.props.onEnterDraggingState != "undefined") {
        this.props.onEnterDraggingState(this.props.primitive, e);
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.primitive.changed || shallowCompare(this, nextProps, nextState)
    );
  }

  setPrimitiveProps(props) {
    this.props.primitive.setProps(props);
    this.setState({});
  }

  setPrimitiveArrayValue(name, index, value) {
    this.props.primitive.setPropArrayValue(name, index, value);
    this.setState({});
  }
}

module.exports = Node;
