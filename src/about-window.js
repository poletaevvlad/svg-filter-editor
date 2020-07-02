import React from "react";

import Hidable from "./components/hidable.js";

let REACT_LICENSE = (
  <div className="text">
    <p>BSD License</p>
    <p>For React software</p>
    <p>
      Copyright (c) 2013-present, Facebook, Inc.
      <br />
      All rights reserved.
    </p>
    <p>
      Redistribution and use in source and binary forms, with or without
      modification, are permitted provided that the following conditions are
      met:
    </p>
    <ul>
      <li>
        Redistributions of source code must retain the above copyright notice,
        this list of conditions and the following disclaimer.
      </li>
      <li>
        Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.
      </li>
      <li>
        Neither the name Facebook nor the names of its contributors may be used
        to endorse or promote products derived from this software without
        specific prior written permission.
      </li>
    </ul>
    <p>
      THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
      IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
      THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
      PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
      CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
      EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
      PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
      PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
      LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
      NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
      SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
    </p>
  </div>
);

function MITLicense(copyright) {
  return (
    <div className="text">
      <p>The MIT License (MIT)</p>
      <p>Copyright (c) {copyright}</p>
      <p>
        Permission is hereby granted, free of charge, to any person obtaining a
        copy of this software and associated documentation files (the
        "Software"), to deal in the Software without restriction, including
        without limitation the rights to use, copy, modify, merge, publish,
        distribute, sublicense, and/or sell copies of the Software, and to
        permit persons to whom the Software is furnished to do so, subject to
        the following conditions:
      </p>
      <p>
        The above copyright notice and this permission notice shall be included
        in all copies or substantial portions of the Software.
      </p>
      <p>
        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
        OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
        IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
        CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
        TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
        SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
      </p>
    </div>
  );
}

class AboutWindow extends React.Component {
  render() {
    return (
      <div className="about">
        <div className="background" onClick={this.props.onClose} />
        <div className="box">
          <div className="leftside">
            <div className="app-title">SVG filter editor</div>
            <a
              className="description-line"
              href="https://github.com/poletaevvlad/svg-filter-editor"
            >
              <span className="link-label">Github: </span>
              <span className="link">svg-filter-editor</span>
            </a>
            <a
              className="description-line"
              href="https://github.com/poletaevvlad/"
            >
              <span className="link-label">by: </span>
              <span className="link">Vlad Poletaev</span>
            </a>
          </div>
          <div className="licenses">
            <div>This program uses the following open source projects:</div>

            <Hidable name="React">
              <a
                className="description-line"
                href="https://facebook.github.io/react/"
              >
                <span className="link-label">Website: </span>
                <span className="link">facebook.github.io/react</span>
              </a>
              <a
                className="description-line"
                href="https://github.com/facebook/react"
              >
                <span className="link-label">Github: </span>
                <span className="link">facebook/react</span>
              </a>
              <div className="license">
                <div className="license-label">
                  License: <b>BSD 3-clause</b>
                </div>
                {REACT_LICENSE}
              </div>
            </Hidable>

            <Hidable name="react-slider">
              <a
                className="description-line"
                href="https://github.com/mpowaga/react-slider"
              >
                <span className="link-label">Github: </span>
                <span className="link">mpowaga/react-slider</span>
              </a>
              <div className="license">
                <div className="license-label">
                  License: <b>MIT</b>
                </div>
                {MITLicense("2014 Michal Powaga")}
              </div>
            </Hidable>

            <Hidable name="React Color">
              <a
                className="description-line"
                href="https://casesandberg.github.io/react-color/"
              >
                <span className="link-label">Website: </span>
                <span className="link">casesandberg.github.io/react-color</span>
              </a>
              <a
                className="description-line"
                href="https://github.com/casesandberg/react-color/"
              >
                <span className="link-label">Github: </span>
                <span className="link">casesandberg/react-color</span>
              </a>
              <div className="license">
                <div className="license-label">
                  License: <b>MIT</b>
                </div>
                {MITLicense("2015 Case Sandberg")}
              </div>
            </Hidable>

            <div>
              This program is distributed under <b>MIT license:</b>
            </div>
            {MITLicense("2017 Vlad Poletaev")}
          </div>
        </div>
      </div>
    );
  }
}

module.exports = AboutWindow;
