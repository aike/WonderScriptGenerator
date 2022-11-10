import React, { Component } from 'react';
import './App.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import KspBuilder from './KspBuilder';
import DsBuilder from './DsBuilder';

class App extends Component {
  constructor() {
    super();
    this.state = {
      target: 'ksp',
      panel_width: "970",
      panel_height: "200",
      panel_image: "mypanel.png",
      icon_image: "myicon.png",
      volume: false,
      attack: false,
      decay: false,
      sustain: false,
      release: false,
      code: "on init\n\nend on\n"
    };

    this.codecss = {
        width: '98%',
        height: '590px',
        borderRadius: '7px',
        border: '2px solid #ddd',
        marginTop: '0px',
        fontSize: '13px'
    };

    this.cb = null;
  }

  componentDidMount() {
    this.kspBuilder = new KspBuilder();
    this.DsBuilder = new DsBuilder();
    this.cb = this.kspBuilder;
    let code = this.cb.getCode(this.state);
    this.setState({"code":code});
  }

  // check box
  onChange = (e) => {
    let key = e.target.id;
    let value = e.target.checked;
    let code = this.cb.getCode({[key]:value});
    this.setState({[key]:value, "code":code});
  }

  // text field
  onChange2 = (e) => {
    let key = e.target.id;
    let value = e.target.value;
    let code = this.cb.getCode({[key]:value});
    this.setState({[key]:value, "code":code});
  }

  // radio button
  onChange3 = (e) => {
    console.log(e.target);
    let key = e.target.name;
    let value = e.target.value;
    console.log(key, value);
    let code;
    if (key === 'target') {
      if (value === 'ksp') {
        this.cb = this.kspBuilder;
      } else if (value == 'ds') {
        this.cb = this.DsBuilder;
      }
      code = this.cb.getCode(this.state);
    } else {
      code = this.cb.getCode({[key]:value});
    }
    this.setState({[key]:value, "code":code});
  }

  render() {    
    return (
    <div className="App">
      <header className="App-header">
        <div id="title">Wonder Script Generator</div>
        <div id="subtitle">A Virtual Instrument Engine Script Generator for KONTAKT, UVI Falcon and Decent Sampler</div>
      </header>
      <div className="ControlArea">
        <div className="frame">
          <h1>Target</h1>
          <div className="sample">
            <label htmlFor="select1"><input type="radio" name="target" id="select1" value="ksp" checked={this.state.target==="ksp"} onChange={this.onChange3} />KONTAKT (KSP)</label>
            <label htmlFor="select2"><input type="radio" name="target" id="select2" value="uvi" checked={this.state.target==="uvi"} onChange={this.onChange3} />Falcon (UVI Script)</label>
            <label htmlFor="select3"><input type="radio" name="target" id="select3" value="ds"  checked={this.state.target==="ds"}  onChange={this.onChange3} />Decent Sampler (dspreset)</label>
          </div>
        </div>

        <div className="frame">
          <h1>General</h1>
          <div className="general_item">
            Script Title:
            <input type="text" id="script_title" value={this.state.panel_image} onChange={this.onChange2} />
          </div>
          <div className="general_item">
            <input type="radio" id="r2_1" name="knob_type" value="standard" checked={this.state.knob_type==="standard"} onChange={this.onChange3} /><label htmlFor="r2_1">Standard Knob</label>
            <input type="radio" id="r2_2" name="knob_type" value="custom" checked={this.state.knob_type==="custom"} onChange={this.onChange3} /><label htmlFor="r2_2">Custom Knob</label>
          </div>
        </div>

        <div className="frame">
          <h1>Panel</h1>
          <div className="panel_item">
            BG Image File:
            <input type="text" id="panel_image" value={this.state.panel_image} onChange={this.onChange2} />
          </div>
          <div className="panel_item">
            width:
            <input type="radio" id="r1_1" name="panel_width" value="633" checked={this.state.panel_width==="633"} onChange={this.onChange3} /><label htmlFor="r1_1">633px</label>
            <input type="radio" id="r1_2" name="panel_width" value="970" checked={this.state.panel_width==="970"} onChange={this.onChange3} /><label htmlFor="r1_2">970px</label>
          </div>
          <div className="panel_item">
            height:
            <input type="number" id="panel_height" value={this.state.panel_height} onChange={this.onChange2} />
          </div>
          <div className="icon_item">
            Icon Image File:
            <input type="text" id="icon_image" value={this.state.icon_image} onChange={this.onChange2} />
          </div>
        </div>

        <div className="frame">
          <h1>Control</h1>
          <h2>Output</h2>
          <ul>
            <li><input type="checkbox" id="volume"  checked={this.state.volume}  onChange={this.onChange} /><label htmlFor="volume">Volume</label></li>
          </ul>
          <h2>Filter</h2>
          <ul>
            <li><input type="checkbox" id="lpf"  checked={this.state.lpf}  onChange={this.onChange} /><label htmlFor="lpf">LPF</label></li>
          </ul>
          <h2>Envelope Generator</h2>
          <ul>
            <li><input type="checkbox" id="attack"  checked={this.state.attack}  onChange={this.onChange} /><label htmlFor="attack">Attack</label></li>
            <li><input type="checkbox" id="decay"   checked={this.state.decay}   onChange={this.onChange} /><label htmlFor="decay">Decay</label></li>
            <li><input type="checkbox" id="sustain" checked={this.state.sustain} onChange={this.onChange} /><label htmlFor="sustain">Sustain</label></li>
            <li><input type="checkbox" id="release" checked={this.state.release} onChange={this.onChange} /><label htmlFor="release">Release</label></li>
          </ul>
          <h2>FX</h2>
          <ul>
            <li><input type="checkbox" id="reverb"  checked={this.state.reverb}  onChange={this.onChange} /><label htmlFor="reverb">Reverb</label></li>
          </ul>
        </div>
      </div>

      <div className="CodeArea">
        <SyntaxHighlighter language="xquery" style={a11yDark} customStyle={this.codecss}>
          {this.state.code}
        </SyntaxHighlighter>
      </div>

    </div>
    );
  }
}

export default App;
