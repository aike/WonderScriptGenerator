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
      panel_width: '970',
      panel_height: '400',
      panel_image: 'mypanel.png',
      icon_image: 'myicon.png',
      script_title: 'main',
      knob_type: 'default',
      custom_knob: 'knob.png',
      volume: false,
      attack: false,
      decay: false,
      sustain: false,
      release: false,
      code: 'on init\n\nend on\n'
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

  onClickCode = (e) => {
    let range = document.createRange();
    let node = document.querySelector('code');
    range.setStart(node.firstChild, 0);
    range.setEnd(node.lastChild, 0);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  }

  getHighLightStyle = () => {
    let style = 'xquery';
    switch (this.state.target){
      case 'ksp':
        style = 'xquery';
        break;
      case 'uvi':
        style = 'lua';
        break;
      case 'ds':
        style = 'xml';
        break;
      default:
        style = 'xquery';
    }
    return style;
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
          <h1 className="h1_65 margin_plus">Target</h1>
          <div class="ControlVRadio"><input type="radio" class="Radio" name="target" id="r1_1" value="ksp" checked={this.state.target==="ksp"} onChange={this.onChange3} /><label class="RadioLabel" htmlFor="r1_1">KONTAKT (KSP)</label><div class="RadioMark"></div></div>
          <div class="ControlVRadio"><input type="radio" class="Radio" name="target" id="r1_2" value="uvi" checked={this.state.target==="uvi"} onChange={this.onChange3} /><label class="RadioLabel" htmlFor="r1_2">Falcon (UVI Script)</label><div class="RadioMark"></div></div>
          <div class="ControlVRadio"><input type="radio" class="Radio" name="target" id="r1_3" value="ds"  checked={this.state.target==="ds"}  onChange={this.onChange3} /><label class="RadioLabel" htmlFor="r1_3">Decent Sampler (dspreset)</label><div class="RadioMark"></div></div>
        </div>

        <div className="frame">
          <h1 className="h1_80">General</h1>
          <div class="ControlLabel">Script Title</div>
          <input class="ControlText" type="text" id="script_title" value={this.state.script_title} onChange={this.onChange2} />

          <div class="ControlLabelRadio">Knob Type</div>
          <div class="ControlRadio"><input type="radio" class="Radio" name="knob_type" id="r2_1" value="default" checked={this.state.knob_type==="default"} onChange={this.onChange3} /><label class="RadioLabel" htmlFor="r2_1">Default</label><div class="RadioMark"></div></div>
          <div class="ControlRadio"><input type="radio" class="Radio" name="knob_type" id="r2_2" value="custom"  checked={this.state.knob_type==="custom"} onChange={this.onChange3} /><label class="RadioLabel" htmlFor="r2_2">Custom</label><div class="RadioMark"></div></div>

          <div class="ControlLabel">Custom Knob File</div>
          <input class="ControlText" type="text" id="custom_knob" value={this.state.custom_knob} onChange={this.onChange2} disabled={this.state.knob_type==="default"}/>

          <div class="ControlLabel">Custom Knob Size</div>
          <div class="ControlWH">
            <input class="ControlWH_W" type="number" value="100" disabled={this.state.knob_type==="default"}/>
            x
            <input class="ControlWH_H" type="number" value="100" disabled={this.state.knob_type==="default"}/>
          </div>
        </div>

        <div className="frame">
          <h1 className="h1_65">Panel</h1>
          <div class="ControlLabel">Panel Image File</div>
          <input class="ControlText" type="text" id="panel_image" value={this.state.panel_image} onChange={this.onChange2} />

          <div class="ControlLabelRadio">Panel Width</div>
          <div class={this.state.target==='ksp' ? 'ControlRadio' : 'ControlHide'}><input type="radio" class="Radio" name="panel_width" id="r3_1" value="633" checked={this.state.panel_width==="633"} onChange={this.onChange3} /><label class="RadioLabel" htmlFor="r3_1">633px</label><div class="RadioMark"></div></div>
          <div class={this.state.target==='ksp' ? 'ControlRadio' : 'ControlHide'}><input type="radio" class="Radio" name="panel_width" id="r3_2" value="970" checked={this.state.panel_width==="970"} onChange={this.onChange3} /><label class="RadioLabel" htmlFor="r3_2">970px</label><div class="RadioMark"></div></div>
          <input class={this.state.target==='uvi' ? 'ControlText' : 'ControlHide'} type="number" value="720" disabled />
          <input class={this.state.target==='ds' ? 'ControlText' : 'ControlHide'} type="number" value="812" disabled />

          <div class="ControlLabel">Panel Height</div>
          <input class={this.state.target==='ksp' ? 'ControlText' : 'ControlHide'} type="number" id="panel_height" value={this.state.panel_height} onChange={this.onChange2} />
          <input class={this.state.target==='uvi' ? 'ControlText' : 'ControlHide'} type="number" value="480" disabled />
          <input class={this.state.target==='ds' ? 'ControlText' : 'ControlHide'} type="number" value="375" disabled />

          <div class="ControlLabel">Icon Image File</div>
          <input class="ControlText" type="text" id="icon_image" value={this.state.icon_image} onChange={this.onChange2} />
        </div>

        <div className="frame">
          <h1 className="h1_80">Control</h1>
          <h2>Output</h2>
          <ul>
            <li><div class="ControlLabel">Volume</div></li>
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
        <SyntaxHighlighter language={this.getHighLightStyle()} style={a11yDark} customStyle={this.codecss} onClick={this.onClickCode} >
          {this.state.code}
        </SyntaxHighlighter>
      </div>

    </div>
    );
  }
}

export default App;
