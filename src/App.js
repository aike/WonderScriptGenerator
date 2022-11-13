import React, { Component } from 'react';
import './App.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import KspBuilder from './KspBuilder';
import UviBuilder from './UviBuilder';
import DsBuilder from './DsBuilder';

class App extends Component {
  constructor() {
    super();
    this.state = {
      target: 'ksp',
      panel_width: '970',
      panel_height: '200',
      panel_image: 'mypanel.png',
      icon: false,
      icon_image: 'myicon.png',
      script_title: 'main',
      knob_type: 'default',
      knob_image: 'myknob.png',
      custom_knob_w: '64',
      custom_knob_h: '64',
      custom_knob_step: '31',

      volume: false,
      volume_x: '50',
      volume_y: '30',

      lpf: false,
      lpf_x: '200',
      lpf_y: '120',

      attack: false,
      attack_x: '200',
      attack_y: '30',

      decay: false,
      decay_x: '300',
      decay_y: '30',

      sustain: false,
      sustain_x: '400',
      sustain_y: '30',

      release: false,
      release_x: '500',
      release_y: '30',

      reverb: false,
      reverb_x: '400',
      reverb_y: '120',

      code: 'on init\n\nend on\n'
    };

    this.codecss = {
        position: 'relative',
        width: 'calc(100% - 30px)',
        height: '100%',
        borderRadius: '7px',
        border: '2px solid #ddd',
        marginTop: '0px',
        marginLeft: '-5px',
        fontSize: '13px'
    };

    this.cb = null;
  }

  componentDidMount() {
    this.kspBuilder = new KspBuilder();
    this.uviBuilder = new UviBuilder(); 
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
    let key = e.target.name;
    let value = e.target.value;
    let code;
    if (key === 'target') {
      if (value === 'ksp') {
        this.cb = this.kspBuilder;
      } else if (value === 'uvi') {
        this.cb = this.uviBuilder;
      } else if (value === 'ds') {
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

  onClickCopy = (e) => {
    this.onClickCode();
    navigator.clipboard.writeText(window.getSelection());
    window.getSelection().removeAllRanges();
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
        <div id="subtitle">Virtual Instrument Engine Script Generator for KONTAKT, UVI Falcon and Decent Sampler</div>
      </header>
      <div className="Wrapper">
      <div className="ControlArea">
        <div className="frame">
          <h1 className="h1_65 margin_plus">Target</h1>
          <div className="ControlVRadio"><input type="radio" className="Radio" name="target" id="r1_1" value="ksp" checked={this.state.target==="ksp"} onChange={this.onChange3} /><label className="RadioLabel" htmlFor="r1_1">KONTAKT (KSP)</label><div className="RadioMark"></div></div>
          <div className="ControlVRadio"><input type="radio" className="Radio" name="target" id="r1_2" value="uvi" checked={this.state.target==="uvi"} onChange={this.onChange3} /><label className="RadioLabel" htmlFor="r1_2">Falcon (UVI Script)</label><div className="RadioMark"></div></div>
          <div className="ControlVRadio"><input type="radio" className="Radio" name="target" id="r1_3" value="ds"  checked={this.state.target==="ds"}  onChange={this.onChange3} /><label className="RadioLabel" htmlFor="r1_3">Decent Sampler (dspreset)</label><div className="RadioMark"></div></div>
        </div>

        <div className="frame">
          <h1 className="h1_80">General</h1>
          <div className="ControlLabel">Script Title</div>
          <input className="ControlText" type="text" id="script_title" value={this.state.script_title} onChange={this.onChange2} disabled={this.state.target!=='ksp'}/>

          <div className="ControlLabelRadio">Knob Type</div>
          <div className="ControlRadio"><input type="radio" className="Radio" name="knob_type" id="r2_1" value="default" checked={this.state.knob_type==="default"} onChange={this.onChange3} /><label className="RadioLabel" htmlFor="r2_1">Default</label><div className="RadioMark"></div></div>
          <div className="ControlRadio"><input type="radio" className="Radio" name="knob_type" id="r2_2" value="custom"  checked={this.state.knob_type==="custom"} onChange={this.onChange3} /><label className="RadioLabel" htmlFor="r2_2">Custom</label><div className="RadioMark"></div></div>

          <div className="ControlLabel">Custom Knob File</div>
          <input className="ControlText" type="text" id="knob_image" value={this.state.knob_image} onChange={this.onChange2} disabled={this.state.knob_type==="default"}/>
          <div className="ControlLabel">Custom Knob Size</div>
          <div className="ControlWH">
            <input className="ControlWH_W" type="number" id="custom_knob_w" value={this.state.custom_knob_w} onChange={this.onChange2} disabled={this.state.knob_type==="default"}/>
            x
            <input className="ControlWH_H" type="number" id="custom_knob_h" value={this.state.custom_knob_h} onChange={this.onChange2} disabled={this.state.knob_type==="default"}/>
          </div>
          <div className="ControlLabel">Custom Knob Step</div>
            <input className="ControlText" type="number" id="custom_knob_step" value={this.state.custom_knob_step} onChange={this.onChange2} disabled={this.state.knob_type==="default"}/>
          </div>

        <div className="frame">
          <h1 className="h1_65">Panel</h1>
          <div className="ControlLabel">Panel Image File</div>
          <input className="ControlText" type="text" id="panel_image" value={this.state.panel_image} onChange={this.onChange2} />

          <div className="ControlLabelRadio">Panel Width</div>
          <div className={this.state.target==='ksp' ? 'ControlRadio3' : 'ControlHide'}><input type="radio" className="Radio" name="panel_width" id="r3_1" value="633" checked={this.state.panel_width==="633"} onChange={this.onChange3} /><label className="RadioLabel" htmlFor="r3_1">633</label><div className="RadioMark"></div></div>
          <div className={this.state.target==='ksp' ? 'ControlRadio3' : 'ControlHide'}><input type="radio" className="Radio" name="panel_width" id="r3_2" value="770" checked={this.state.panel_width==="770"} onChange={this.onChange3} /><label className="RadioLabel" htmlFor="r3_2">770</label><div className="RadioMark"></div></div>
          <div className={this.state.target==='ksp' ? 'ControlRadio3' : 'ControlHide'}><input type="radio" className="Radio" name="panel_width" id="r3_3" value="970" checked={this.state.panel_width==="970"} onChange={this.onChange3} /><label className="RadioLabel" htmlFor="r3_3">970</label><div className="RadioMark"></div></div>
          <input className={this.state.target==='uvi' ? 'ControlText' : 'ControlHide'} type="number" value="720" disabled />
          <input className={this.state.target==='ds' ? 'ControlText' : 'ControlHide'} type="number" value="812" disabled />

          <div className="ControlLabel">Panel Height</div>
          <input className={this.state.target==='ksp' ? 'ControlText' : 'ControlHide'} type="number" id="panel_height" value={this.state.panel_height} onChange={this.onChange2} />
          <input className={this.state.target==='uvi' ? 'ControlText' : 'ControlHide'} type="number" value="480" disabled />
          <input className={this.state.target==='ds' ? 'ControlText' : 'ControlHide'} type="number" value="375" disabled />

          <div className="ControlLabel">Custom Icon</div>
          <div className="ControlCheckSimple"><input type="checkbox" className="Check" id="icon" checked={this.state.icon} onChange={this.onChange} disabled={this.state.target!=='ksp'}/>
          <label className="CheckLabel" htmlFor="icon" /><div className="CheckMark"/></div>
          <div className="ControlLabel">Icon Image File</div>
          <input className="ControlText" type="text" id="icon_image" value={this.state.icon_image} onChange={this.onChange2} disabled={this.state.target!=='ksp' || !this.state.icon} />
        </div>

        <div className="frame">
          <h1 className="h1_80">Control</h1>
          <h2>Output</h2>
          <div className="XY_X">X</div>
          <div className="XY_Y">Y</div>
          <ul>
            <li>
              <div className="ControlLabelCheck">Volume</div>
              <div className="ControlCheck"><input type="checkbox" className="Check" id="volume" checked={this.state.volume} onChange={this.onChange}/>
              <label className="CheckLabel" htmlFor="volume">Show</label><div className="CheckMark"/></div>
              <input className="ControlXY_X" type="number" id="volume_x" value={this.state.volume_x} disabled={!this.state.volume} onChange={this.onChange2}/>
              <input className="ControlXY_Y" type="number" id="volume_y" value={this.state.volume_y} disabled={!this.state.volume} onChange={this.onChange2}/>
            </li>
          </ul>
          <h2>Filter</h2>
          <div className="XY_X">X</div>
          <div className="XY_Y">Y</div>
          <ul>
            <li>
              <div className="ControlLabelCheck">LPF</div>
              <div className="ControlCheck"><input type="checkbox" className="Check" id="lpf" checked={this.state.lpf} onChange={this.onChange}/>
              <label className="CheckLabel" htmlFor="lpf">Show</label><div className="CheckMark"/></div>
              <input className="ControlXY_X" type="number" id="lpf_x" value={this.state.lpf_x} disabled={!this.state.lpf} onChange={this.onChange2}/>
              <input className="ControlXY_Y" type="number" id="lpf_y" value={this.state.lpf_y} disabled={!this.state.lpf} onChange={this.onChange2}/>
            </li>
          </ul>
          <h2>Envelope Generator</h2>
          <div className="XY_X">X</div>
          <div className="XY_Y">Y</div>
          <ul>
            <li>
              <div className="ControlLabelCheck">Attack</div>
              <div className="ControlCheck"><input type="checkbox" className="Check" id="attack" checked={this.state.attack} onChange={this.onChange}/>
              <label className="CheckLabel" htmlFor="attack">Show</label><div className="CheckMark"/></div>
              <input className="ControlXY_X" type="number" id="attack_x" value={this.state.attack_x} disabled={!this.state.attack} onChange={this.onChange2}/>
              <input className="ControlXY_Y" type="number" id="attack_y" value={this.state.attack_y} disabled={!this.state.attack} onChange={this.onChange2}/>
            </li>
            <li>
              <div className="ControlLabelCheck">Decay</div>
              <div className="ControlCheck"><input type="checkbox" className="Check" id="decay" checked={this.state.decay} onChange={this.onChange}/>
              <label className="CheckLabel" htmlFor="decay">Show</label><div className="CheckMark"/></div>
              <input className="ControlXY_X" type="number" id="decay_x" value={this.state.decay_x} disabled={!this.state.decay} onChange={this.onChange2}/>
              <input className="ControlXY_Y" type="number" id="decay_y" value={this.state.decay_y} disabled={!this.state.decay} onChange={this.onChange2}/>
            </li>
            <li>
              <div className="ControlLabelCheck">Sustain</div>
              <div className="ControlCheck"><input type="checkbox" className="Check" id="sustain" checked={this.state.sustain} onChange={this.onChange}/>
              <label className="CheckLabel" htmlFor="sustain">Show</label><div className="CheckMark"/></div>
              <input className="ControlXY_X" type="number" id="sustain_x" value={this.state.sustain_x} disabled={!this.state.sustain} onChange={this.onChange2}/>
              <input className="ControlXY_Y" type="number" id="sustain_y" value={this.state.sustain_y} disabled={!this.state.sustain} onChange={this.onChange2}/>
            </li>
            <li>
              <div className="ControlLabelCheck">Release</div>
              <div className="ControlCheck"><input type="checkbox" className="Check" id="release" checked={this.state.release} onChange={this.onChange}/>
              <label className="CheckLabel" htmlFor="release">Show</label><div className="CheckMark"/></div>
              <input className="ControlXY_X" type="number" id="release_x" value={this.state.release_x} disabled={!this.state.release} onChange={this.onChange2}/>
              <input className="ControlXY_Y" type="number" id="release_y" value={this.state.release_y} disabled={!this.state.release} onChange={this.onChange2}/>
            </li>


          </ul>
          <h2>FX</h2>
          <div className="XY_X">X</div>
          <div className="XY_Y">Y</div>
          <ul>
            <li>
              <div className="ControlLabelCheck">Reverb</div>
              <div className="ControlCheck"><input type="checkbox" className="Check" id="reverb" checked={this.state.reverb} onChange={this.onChange}/>
              <label className="CheckLabel" htmlFor="reverb">Show</label><div className="CheckMark"/></div>
              <input className="ControlXY_X" type="number" id="reverb_x" value={this.state.reverb_x} disabled={!this.state.reverb} onChange={this.onChange2}/>
              <input className="ControlXY_Y" type="number" id="reverb_y" value={this.state.reverb_y} disabled={!this.state.reverb} onChange={this.onChange2}/>
            </li>
          </ul>
        </div>

        <div className="frame">
          <h1 className="h1_65">About</h1>
          <ul>
            <li>
              <div className="ControlLabel">More Information</div>
              <div className="ControlPlaneText"><a href="https://github.com/aike/WonderScriptGenerator/">GitHub</a></div>
            </li>              
            <li>
              <div className="ControlLabel">Author</div>
              <div className="ControlPlaneText"><a href="https://github.com/aike/">aike</a></div>
            </li>
          </ul>
        </div>
      </div>

      <div className="CodeArea">
        <SyntaxHighlighter language={this.getHighLightStyle()} style={a11yDark} customStyle={this.codecss} onClick={this.onClickCode} >
          {this.state.code}
        </SyntaxHighlighter>
        <div id="CopyButton" onClick={this.onClickCopy}><img src="copy.png" /></div>
      </div>
      </div>
    </div>
    );
  }
}

export default App;
