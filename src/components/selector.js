import React from "react";
import focused from "./focused.js";

class Selector extends React.PureComponent {
  render() {
    return (
      <div className="selector">
        {this.props.values.map((val) => {
          let value = val.value;
          return (
            <div
              key={val.value}
              onClick={(e) => {
                focused();
                this.props.onChange(value);
              }}
              className={
                "item " +
                val.class +
                (this.props.value == val.value ? " selected" : "")
              }
            >
              {val.label}
            </div>
          );
        })}
      </div>
    );
  }
}

module.exports = Selector;
