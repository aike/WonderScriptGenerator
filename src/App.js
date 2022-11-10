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
      volume_x: "50",
      volume_y: "50",
      attack: false,
      attack_x: "50",
      attack_y: "100",
      decay: false,
      decay_x: "100",
      decay_y: "100",
      sustain: false,
      sustain_x: "150",
      sustain_y: "100",
      release: false,
      release_x: "200",
      release_y: "100",
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
          <input class="ControlText" type="text" id="script_title" value={this.state.script_title} onChange={this.onChange2} disabled={this.state.target!=='ksp'}/>

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
          <div className="XY_X">X</div>
          <div className="XY_Y">Y</div>
          <ul>
            <li>
              <div class="ControlLabelRadio">Volume</div>
              <div class="ControlCheck"><input type="checkbox" class="Check" id="volume" checked={this.state.volume} onChange={this.onChange}/>
              <label class="CheckLabel" for="volume">Show</label><div class="CheckMark"></div></div>
              <input class="ControlXY_X" type="number" value={this.state.volume_x} disabled={!this.state.volume}/>
              <input class="ControlXY_Y" type="number" value={this.state.volume_x} disabled={!this.state.volume}/>
            </li>
          </ul>
          <h2>Filter</h2>
          <ul>
            <li><input type="checkbox" id="lpf"  checked={this.state.lpf}  onChange={this.onChange} /><label htmlFor="lpf">LPF</label></li>
          </ul>
          <h2>Envelope Generator</h2>
          <div className="XY_X">X</div>
          <div className="XY_Y">Y</div>
          <ul>
            <li>
              <div class="ControlLabelRadio">Attack</div>
              <div class="ControlCheck"><input type="checkbox" class="Check" id="attack" checked={this.state.attack} onChange={this.onChange}/>
              <label class="CheckLabel" for="attack">Show</label><div class="CheckMark"></div></div>
              <input class="ControlXY_X" type="number" id="attack_x" value={this.state.attack_x} disabled={!this.state.attack}/>
              <input class="ControlXY_Y" type="number" id="attack_y" value={this.state.attack_y} disabled={!this.state.attack}/>
            </li>
            <li>
              <div class="ControlLabelRadio">Decay</div>
              <div class="ControlCheck"><input type="checkbox" class="Check" id="decay" checked={this.state.decay} onChange={this.onChange}/>
              <label class="CheckLabel" for="decay">Show</label><div class="CheckMark"></div></div>
              <input class="ControlXY_X" type="number" id="decay_x" value={this.state.decay_x} disabled={!this.state.decay}/>
              <input class="ControlXY_Y" type="number" id="decay_y" value={this.state.decay_y} disabled={!this.state.decay}/>
            </li>
            <li>
              <div class="ControlLabelRadio">Sustain</div>
              <div class="ControlCheck"><input type="checkbox" class="Check" id="sustain" checked={this.state.sustain} onChange={this.onChange}/>
              <label class="CheckLabel" for="sustain">Show</label><div class="CheckMark"></div></div>
              <input class="ControlXY_X" type="number" id="sustain_x" value={this.state.sustain_x} disabled={!this.state.sustain}/>
              <input class="ControlXY_Y" type="number" id="sustain_y" value={this.state.sustain_y} disabled={!this.state.sustain}/>
            </li>
            <li>
              <div class="ControlLabelRadio">Release</div>
              <div class="ControlCheck"><input type="checkbox" class="Check" id="release" checked={this.state.release} onChange={this.onChange}/>
              <label class="CheckLabel" for="release">Show</label><div class="CheckMark"></div></div>
              <input class="ControlXY_X" type="number" id="release_x" value={this.state.release_x} disabled={!this.state.release}/>
              <input class="ControlXY_Y" type="number" id="release_y" value={this.state.release_y} disabled={!this.state.release}/>
            </li>


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
