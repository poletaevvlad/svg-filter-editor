import React from "react";
import Node from "./node-ui.js";
import Primitive from "./primitive.js";
import Connection from "./connection.js";
import NodeSelector from "./node-selector.js";

class ConnectionGraphics extends React.PureComponent {
  render() {
    let path = this.generatePath();
    return (
      <g className={"connection" + (this.props.selected ? " selected" : "")}>
        <path d={path} className="outline" />
        <path d={path} className="line" />
      </g>
    );
  }

  generatePath() {
    let x1, x2, y1, y2;
    if (this.props.d1 == "output") {
      x1 = this.props.x1;
      y1 = this.props.y1;
      x2 = this.props.x2;
      y2 = this.props.y2;
    } else {
      x1 = this.props.x2;
      y1 = this.props.y2;
      x2 = this.props.x1;
      y2 = this.props.y1;
    }
    let offset = Math.abs(x2 - x1) * 0.3;
    return `M ${x1} ${y1} C ${x1 + offset} ${y1}, ${
      x2 - offset
    } ${y2}, ${x2} ${y2}`;
  }
}

function SelectionBox(props) {
  let x = props.width < 0 ? props.x + props.width : props.x;
  let y = props.height < 0 ? props.y + props.height : props.y;
  return (
    <div
      id="selection-rect"
      style={{
        left: x,
        top: y,
        width: Math.abs(props.width),
        height: Math.abs(props.height),
      }}
    />
  );
}

class NodesContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      left: 0,
      top: 0,
    };

    this._handleMouseDown = this._onMouseDown.bind(this);
    this._handleMouseUp = this._onMouseUp.bind(this);
    this._handleMouseMove = this._onMouseMove.bind(this);
    this._handleDoubleClick = this._onDoubleClick.bind(this);

    this._mouseX = 0;
    this._mouseY = 0;
    this._isPanning = false;
    this._isDragging = false;
    this._isConnecting = false;
    this._isSelecting = false;
    this._connectionStart = null;
    this._connectionEnd = null;
    this._handleNodeEnderDraggingState = this._onStartedNodeDragging.bind(this);
    this._handleKeyDown = this._onKeyDown.bind(this);
    this._handleGlobalClick = this._onGlobalClick.bind(this);
    this._handleBlur = this._onWindowBlur.bind(this);
    this._handleAddPrimitive = this._onPrimitiveAdded.bind(this);
    this._handleElementFocused = this._onElementFocused.bind(this);
    this.selected = [];
    this.tempSelected = [];

    this._selectionBoxX = 0;
    this._selectionBoxY = 0;

    this._nodeSelectorOpen = false;
    this._instructionsVisible = true;
    this._nodeSelectorX = 0;
    this._nodeSelectorY = 0;
  }

  _isSelected(node, list) {
    if (typeof list == "undefined") {
      list = this.selected;
    }
    return list.findIndex((val) => val.id == node.id) >= 0;
  }

  render() {
    let i = 0;
    return (
      <div
        id="nodes-container"
        ref="container"
        style={{ right: `${this.props.right + 7}px` }}
        onMouseDown={this._handleMouseDown}
        onDoubleClick={this._handleDoubleClick}
      >
        {this._nodeSelectorOpen ? (
          <NodeSelector
            x={this._nodeSelectorX}
            y={this._nodeSelectorY}
            onSelected={this._handleAddPrimitive}
          />
        ) : null}
        {this._shouldShowSelectionBox() ? (
          <SelectionBox
            x={this._selectionBoxX}
            y={this._selectionBoxY}
            width={this._mouseX - this._selectionBoxX}
            height={this._mouseY - this._selectionBoxY}
          />
        ) : null}
        <div
          id="nodes-origin"
          ref="origin"
          style={{ left: `${this.state.left}px`, top: `${this.state.top}px` }}
        >
          {this.props.filter.primitives.map((primitive) => {
            let NodeComponent = primitive.nodeComponentClass;
            let selected =
              this._isSelected(primitive) ||
              this._isSelected(primitive, this.tempSelected);
            return (
              <div
                className="node-position"
                key={primitive.id}
                style={{
                  left: `${primitive.positionX}px`,
                  top: `${primitive.positionY}px`,
                  zIndex: i++,
                }}
              >
                <NodeComponent
                  onEnterDraggingState={this._handleNodeEnderDraggingState}
                  primitive={primitive}
                  dragging={this._isDragging && selected}
                  selected={selected}
                  onUpdate={this.props.onUpdate}
                  {...(this._isConnecting &&
                  this._connectionEnd != null &&
                  this._connectionEnd.primitive == primitive.id
                    ? {
                        ioSelectionType: this._connectionEnd.type,
                        ioSelectionId: this._connectionEnd.io,
                      }
                    : {})}
                />
              </div>
            );
          })}
        </div>
        <svg id="nodes-connections" width="100%" height="100%">
          {this.props.filter.connections.map((connection) => {
            let inputPosition = this.getConnectorCenter(
              Primitive.getInputId(
                connection.inputPrimitive,
                connection.inputIOID
              )
            );
            let outputPosition = this.getConnectorCenter(
              Primitive.getOutputId(
                connection.outputPrimitive,
                connection.outputIOID
              )
            );
            return (
              <ConnectionGraphics
                x1={inputPosition.x}
                y1={inputPosition.y}
                d1="input"
                x2={outputPosition.x}
                y2={outputPosition.y}
                d2="output"
                key={connection.id}
                selected={this._isConnectionSelected(connection)}
              />
            );
          })}
          {this._isConnecting ? (
            <ConnectionGraphics
              x1={this._connectionStart.position.x}
              y1={this._connectionStart.position.y}
              x2={
                this._connectionEnd != null
                  ? this._connectionEnd.position.x
                  : this._mouseX
              }
              y2={
                this._connectionEnd != null
                  ? this._connectionEnd.position.y
                  : this._mouseY
              }
              d1={this._connectionStart.type}
              d2={this._connectionStart.type == "input" ? "output" : "input"}
              selected={true}
            />
          ) : null}
        </svg>

        <div
          id="instruction"
          {...(this._instructionsVisible ? { className: "visible" } : null)}
        >
          <i>Double-click</i> to add nodes. Use <i>middle mouse button</i> to
          pan.
        </div>
      </div>
    );
  }

  _shouldShowSelectionBox() {
    return (
      this._isSelecting &&
      Math.abs(this._selectionBoxX - this._mouseX) > 2 &&
      Math.abs(this._selectionBoxY - this._mouseY) > 2
    );
  }

  componentWillMount() {
    document.addEventListener("keydown", this._handleKeyDown);
    document.addEventListener("click", this._handleGlobalClick);
    document.addEventListener("elementFocused", this._handleElementFocused);
    window.addEventListener("mousemove", this._handleMouseMove);
    document.addEventListener("mouseup", this._handleMouseUp);
    window.addEventListener("blur", this._handleBlur);
  }

  componentDidMount() {
    let origin = this.refs.origin;
    let containerBbox = this.refs.container.getBoundingClientRect();
    for (let i = 0; i < origin.childNodes.length; i++) {
      let node = origin.childNodes[i];
      if (node.classList.contains("node-position")) {
        let child = node.childNodes[0];
        if (child.hasAttribute("data-primitiveid")) {
          let primitive = this.props.filter.getPrimitive(
            parseInt(child.getAttribute("data-primitiveid"))
          );
          let bbox = child.getBoundingClientRect();
          primitive.positionX =
            containerBbox.right -
            containerBbox.left -
            (bbox.right - bbox.left) -
            15;
          primitive.positionY =
            (containerBbox.bottom -
              containerBbox.top -
              (bbox.bottom - bbox.top)) /
            2;
          this.setState(this.state);
          break;
        }
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this._handleKeyDown);
    document.removeEventListener("click", this._handleGlobalClick);
    document.removeEventListener("elementFocused", this._handleElementFocused);
    window.removeEventListener("mousemove", this._handleMouseMove);
    document.removeEventListener("mouseup", this._handleMouseUp);
    window.removeEventListener("blur", this._handleBlur);
  }

  _isConnectionSelected(connection) {
    return (
      this.selected.findIndex(
        (e) =>
          e.id == connection.inputPrimitive ||
          e.id == connection.outputPrimitive
      ) >= 0
    );
  }

  getConnectorCenter(id) {
    let element = document.getElementById(id);
    let nodeElement = element;
    while (nodeElement != null && !nodeElement.classList.contains("node")) {
      nodeElement = nodeElement.parentElement;
    }

    let connectorBBox = element.getBoundingClientRect();
    if (nodeElement == null) {
      return {
        x: (connectorBBox.left + connectorBBox.right) / 2,
        y: connectorBBox.top + connectorBBox.height / 2,
      };
    } else {
      let nodeBBox = nodeElement.getBoundingClientRect();
      let nodeX =
        (connectorBBox.left + connectorBBox.right) / 2 - nodeBBox.left;
      let nodeY = (connectorBBox.top + connectorBBox.bottom) / 2 - nodeBBox.top;
      let primitive = this.props.filter.getPrimitive(
        element.getAttribute("data-primitiveid")
      );
      let x = nodeX + primitive.positionX + this.state.left;
      let y = nodeY + primitive.positionY + this.state.top;
      return { x: x, y: y };
    }
  }

  _onMouseDown(e) {
    if (e.nativeEvent.button == 1) {
      this._isPanning = true;
      document.activeElement.blur();
      e.preventDefault();
    } else if (e.nativeEvent.button == 0) {
      let element = e.target;
      if (element.hasAttribute("data-iotype")) {
        let type = element.getAttribute("data-iotype");
        let primitive = parseInt(element.getAttribute("data-primitiveid"));
        let io = parseInt(element.getAttribute("data-ioid"));
        let connectionStart = null;
        if (type == "input") {
          let connection = this.props.filter.dettachConnection(primitive, io);
          if (connection != null) {
            connectionStart = {
              type: "output",
              primitive: connection.outputPrimitive,
              io: connection.outputIOID,
              position: this.getConnectorCenter(
                Primitive.getOutputId(
                  connection.outputPrimitive,
                  connection.outputIOID
                )
              ),
            };
          }
          this.props.onUpdate();
        }
        this._isConnecting = true;
        if (connectionStart == null) {
          connectionStart = {
            type: type,
            primitive: primitive,
            io: io,
            position: this.getConnectorCenter(element.id),
          };
        }
        this._connectionStart = connectionStart;
        this._connectionEnd = null;
        document.activeElement.blur();
        e.preventDefault();
      } else if (
        element.id == "nodes-container" ||
        element.id == "nodes-connections"
      ) {
        if (!e.nativeEvent.shiftKey) {
          this.selected = [];
        }
        this._isSelecting = true;
        this._selectionBoxX = e.nativeEvent.clientX;
        this._selectionBoxY = e.nativeEvent.clientY;
        document.activeElement.blur();
        e.preventDefault();
      }
      this.setState(this.state);
    }
    this._mouseX = e.nativeEvent.clientX;
    this._mouseY = e.nativeEvent.clientY;
    return true;
  }

  _onMouseUp(e) {
    this._isPanning = false;
    this._isDragging = false;
    if (this._isSelecting) {
      this._isSelecting = null;
      for (let i = 0; i < this.tempSelected.length; i++) {
        if (!this._isSelected(this.tempSelected[i])) {
          this.selected.push(this.tempSelected[i]);
        }
      }
      this._didSelect();
      this.tempSelected = [];
    }
    if (this._isConnecting) {
      this._isConnecting = false;
      if (this._connectionStart != null && this._connectionEnd != null) {
        let input, output;
        if (this._connectionStart.type == "input") {
          input = this._connectionStart;
          output = this._connectionEnd;
        } else {
          input = this._connectionEnd;
          output = this._connectionStart;
        }
        let connection = new Connection(
          output.primitive,
          output.io,
          input.primitive,
          input.io
        );
        this.props.filter.addConnection(connection);
        this.props.onUpdate();
      }
      this._connectionStart = null;
      this._connectionEnd = null;
    }
    this.setState(this.state);
    return false;
  }

  _onMouseMove(e) {
    let dx = e.clientX - this._mouseX;
    let dy = e.clientY - this._mouseY;
    if (this._isPanning) {
      this.setState({
        left: this.state.left + dx,
        top: this.state.top + dy,
      });
    } else if (this._isDragging) {
      this.selected.forEach((primitive) => {
        primitive.positionX += dx;
        primitive.positionY += dy;
      });
      this.setState(this.state);
    } else if (this._isConnecting) {
      let element = e.target;
      if (
        element.hasAttribute("data-iotype") &&
        this._connectionStart.type != element.getAttribute("data-iotype")
      ) {
        this._connectionEnd = {
          type: element.getAttribute("data-iotype"),
          primitive: parseInt(element.getAttribute("data-primitiveid")),
          io: parseInt(element.getAttribute("data-ioid")),
          position: this.getConnectorCenter(element.id),
        };
      } else {
        this._connectionEnd = null;
      }
      this.setState(this.state);
    } else if (this._isSelecting) {
      let width = Math.abs(this._mouseX - this._selectionBoxX);
      let height = Math.abs(this._mouseY - this._selectionBoxY);
      let x =
        this._mouseX < this._selectionBoxX ? this._mouseX : this._selectionBoxX;
      let y =
        this._mouseY < this._selectionBoxY ? this._mouseY : this._selectionBoxY;

      this.tempSelected = [];
      let nodes = document.getElementsByClassName("node");
      for (let i = 0; i < nodes.length; i++) {
        let bbox = nodes[i].getBoundingClientRect();
        if (
          x <= bbox.left &&
          x + width >= bbox.right &&
          y <= bbox.top &&
          y + height >= bbox.bottom
        ) {
          let id = parseInt(nodes[i].getAttribute("data-primitiveid"));
          this.tempSelected.push(this.props.filter.getPrimitive(id));
        }
      }
      this.setState(this.state);
    }
    this._mouseX = e.clientX;
    this._mouseY = e.clientY;
  }

  _didSelect() {
    this.props.filter.pushToFront(this.selected);
  }

  _onStartedNodeDragging(node, e) {
    if (this.selected.indexOf(node) < 0) {
      if (e.nativeEvent.shiftKey) {
        this.selected.push(node);
      } else {
        this.selected = [node];
      }
    }
    this._didSelect();
    document.activeElement.blur();
    this._isDragging = true;
    this.setState(this.state);
  }

  _onKeyDown(e) {
    if (e.code == "Delete") {
      this.selected.forEach((primitive) =>
        this.props.filter.removePrimitive(primitive)
      );
      this.selected = [];
      this.setState(this.state);
      this.props.onUpdate();
    } else if (e.code == "KeyA" && e.ctrlKey && !e.shiftKey && !e.altKey) {
      if (
        !(
          document.activeElement instanceof HTMLInputElement &&
          document.activeElement.getAttribute("type") == "text"
        )
      ) {
        this.selected = this.props.filter.primitives.slice();
        document.activeElement.blur();
        this.setState(this.state);
        e.preventDefault();
        this._didSelect();
      }
    }
  }

  _onDoubleClick(e) {
    if (
      !this._nodeSelectorOpen &&
      (e.target.id == "nodes-origin" || e.target.id == "nodes-connections")
    ) {
      this._nodeSelectorOpen = true;
      this._instructionsVisible = false;
      this._nodeSelectorX = e.nativeEvent.clientX;
      this._nodeSelectorY = e.nativeEvent.clientY;
      this.setState(this.state);
    }
    return true;
  }

  _onGlobalClick(e) {
    if (this._nodeSelectorOpen) {
      let node = e.target;
      while (node != null && node.id != "node-selector") {
        node = node.parentElement;
      }
      if (node == null) {
        this._nodeSelectorOpen = false;
        this.setState(this.state);
      }
    }
  }

  _onWindowBlur(e) {
    if (this._nodeSelectorOpen) {
      this._nodeSelectorOpen = false;
      this.setState(this.state);
    }
  }

  _onPrimitiveAdded(primitive) {
    primitive.positionX =
      (-this.state.left + this._nodeSelectorX - primitive.nodeWidth / 2) | 0;
    primitive.positionY = -this.state.top + this._nodeSelectorY - 30;
    this.props.filter.addPrimitive(primitive);
    this._nodeSelectorOpen = false;
    this.setState(this.state);
  }

  _onElementFocused() {
    this.selected = [];
    this.setState(this.state);
  }
}

module.exports = NodesContainer;
