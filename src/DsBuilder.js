class DsBuilder {
  constructor() {
    this.code = "";
    this.params = {
      panel_width: '812',
      panel_height: '375',
      panel_image: 'mypanel.png',
      knob_type: 'default',
      knob_image: 'myknob.png',

      volume: false,
      volume_x: '50',
      volume_y: '30',

      lpf: false,
      lpf_x: '50',
      lpf_y: '170',

      attack: false,
      attack_x: '50',
      attack_y: '100',

      decay: false,
      decay_x: '150',
      decay_y: '100',

      sustain: false,
      sustain_x: '250',
      sustain_y: '100',

      release: false,
      release_x: '350',
      release_y: '100',

      reverb: false,
      reverb_x: '250',
      reverb_y: '170',
    }


    this.initHead = 
      '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<DecentSampler>\n'
    + '  <groups>\n'
    + '     <group>\n'
    + '        <sample rootNote="60" loNote="60" hiNote="72" loopStart="100" loopEnd="500" path="wav/c4.wav" />\n'
    + '     </group>\n'
    + '  </groups>\n'
    + '  <ui bgImage="<PANEL_IMAGE>" width="812" height="375">\n'
    + '    <tab name="main">\n'
    + '\n'
    ;
    
    this.initTail1 = 
      '    </tab>\n'
    + '  </ui>\n'
    ;

    this.initTail2 = 
      '</DecentSampler>\n'
    ;

    this.volumeInit =
      '      <labeled-knob x="<X>" y="<Y>"\n'
    + '        width="80" label="VOLUME" textSize="20"\n'
    + '        type="float" minValue="0" maxValue="2" value="1">\n'
    + '        <binding type="amp" level="instrument" position="0" parameter="AMP_VOLUME" />\n'
    + '      </labeled-knob>\n'
    ;

    this.attackInit =
      '      <labeled-knob x="<X>" y="<Y>"\n'
    + '        width="80" label="Attack" textSize="20"\n'
    + '        type="float" minValue="0.0" maxValue="4.0" value="0.0">\n'
    + '        <binding type="amp" level="instrument" position="0" parameter="ENV_ATTACK" />\n'
    + '      </labeled-knob>\n'
    ;

    this.decayInit =
      '      <labeled-knob x="<X>" y="<Y>"\n'
    + '        width="80" label="Decay" textSize="20"\n'
    + '        type="float" minValue="0.0" maxValue="4.0" value="0.0">\n'
    + '        <binding type="amp" level="instrument" position="0" parameter="ENV_DECAY" />\n'
    + '      </labeled-knob>\n'
    ;

    this.sustainInit =
      '      <labeled-knob x="<X>" y="<Y>"\n'
    + '        width="80" label="Sustain" textSize="20"\n'
    + '        type="float" minValue="0.0" maxValue="1.0" value="1.0">\n'
    + '        <binding type="amp" level="instrument" position="0" parameter="ENV_SUSTAIN" />\n'
    + '      </labeled-knob>\n'
    ;

    this.releaseInit =
      '      <labeled-knob x="<X>" y="<Y>"\n'
    + '        width="80" label="Release" textSize="20"\n'
    + '        type="float" minValue="0.0" maxValue="4.0" value="1.0">\n'
    + '        <binding type="amp" level="instrument" position="0" parameter="ENV_RELEASE" />\n'
    + '      </labeled-knob>\n'
    ;

    this.lpfInit =
      '      <labeled-knob x="<X>" y="<Y>"\n'
    + '        width="80" label="CutOff" textSize="20"\n'
    + '        type="float" minValue="0" maxValue="1" value="1">\n'
    + '        <binding type="effect" level="instrument" position="0" parameter="FX_FILTER_FREQUENCY"\n'
    + '           translation="table"\n' 
    + '           translationTable="0,33;0.3,150;0.4,450;0.5,1100;0.7,4100;0.9,11000;1.0001,22000"/>\n'
    + '      </labeled-knob>\n'
    + '\n'
    + '      <labeled-knob x="<X>" y="<Y>"\n'
    + '        width="80" label="Resonance" textSize="20"\n'
    + '        type="float" minValue="0" maxValue="2" value="1">\n'
    + '        <binding type="effect" level="instrument" position="0" parameter="FX_FILTER_RESONANCE"/>\n'
    + '      </labeled-knob>\n'
    ;

    this.lpfEffect = 
    '    <effect type="lowpass" frequency="22000.0" resonance="1.0"/>\n';

    this.code = this.getCode({init:true}, true);
  }

  getCode(state, force) {
    let modifyFlag = false;
    if (force) {
      modifyFlag = true;
    }
    for (const key in state) {
      if (this.params.hasOwnProperty(key)) {
        if (this.params[key] !== state[key]) {
          this.params[key] = state[key];
          modifyFlag = true;
        }
      }    
    }
    if (!modifyFlag) {
      console.log("cache hit");
      return this.code;
    }

    let init = this.initHead
      .replace("<PANEL_IMAGE>", this.params.panel_image)
      ;

    let effects = '';
    if ( this.params.lpf || this.params.reverb) {
      effects = '  <effects>\n';
    }

    if (this.params.volume) {
      init += this.volumeInit.replace('<X>', this.params.volume_x).replace('<Y>', this.params.volume_y) + '\n\n';
    }
    if (this.params.attack) {
      init += this.attackInit.replace('<X>', this.params.attack_x).replace('<Y>', this.params.attack_y) + '\n\n';
    }
    if (this.params.decay) {
      init += this.decayInit.replace('<X>', this.params.decay_x).replace('<Y>', this.params.decay_y) + '\n\n';
    }
    if (this.params.sustain) {
      init += this.sustainInit.replace('<X>', this.params.sustain_x).replace('<Y>', this.params.sustain_y) + '\n\n';
    }
    if (this.params.release) {
      init += this.releaseInit.replace('<X>', this.params.release_x).replace('<Y>', this.params.release_y) + '\n\n';
    }
    if (this.params.lpf) {
      let x100 = Number(this.params.lpf_x) + 100;
      init += this.lpfInit
      .replace('<X>', this.params.lpf_x).replace('<Y>', this.params.lpf_y)
      .replace('<X>', x100).replace('<Y>', this.params.lpf_y)
      + '\n';
      effects += this.lpfEffect + '\n\n';
    }

    if (effects !== '') {
      effects += '  </effects>\n\n';
    }
    this.code = init + this.initTail1 + effects + this.initTail2;
    this.code = this.code.replace(/\n\n\n+/g, "\n\n");
    return this.code;
  }
}

export default DsBuilder;
