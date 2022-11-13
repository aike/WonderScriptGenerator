class UviBuilder {
  constructor() {
    this.code = '';
    this.params = {
      panel_width: '720',
      panel_height: '480',
      panel_image: 'mypanel.png',
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
      reverb_y: '120'
    }

    this.initHead = 
      'setSize(<WIDTH>, <HEIGHT>)\n'
    + 'setBackground("<PANEL_IMAGE>")\n'
    + 'makePerformanceView()\n'
    + '\n'
    ;

    // ---------------------

    this.volumeInit =
      'local volume\n'
    + 'volume = Knob("Volume", 1, 0, 2)\n'
    + 'volume.pos = {<X>, <Y>}\n'
    + 'volume.mapper = Mapper.Cubic\n'
    + 'volume.unit = Unit.LinearGain\n'
    + 'volume:setValue(Program:getParameter("Volume"))\n'
    + 'volume.changed = function(self)\n'
    + '  Program:setParameter("Volume", self.value)\n'
    + 'end\n'
    + '\n'
    ;

    this.volumeInitWithCustomKnob =
      ''
    ;

    // ---------------------
    this.egInitHead =
      'local eg\n'
    + 'local attack, decay, sustain, release\n'
    + 'for _, module in pairs(Program.layers[1].keygroups[1].modulations) do\n'
    + '  if module:hasParameter("AttackTime") then\n'
    + '    eg = module\n'
    + '  end\n'
    + 'end\n'
    + 'if eg then\n'
    ;

    this.egInitTail =
      'end\n'
    ;

    this.attackInit =
      '  attack = Knob("Attack", 0, 0, 4)\n'
    + '  attack.pos = {<X>, <Y>}\n'
    + '  attack.mapper = Mapper.Quartic\n'
    + '  attack.unit = Unit.Seconds\n'
    + '  attack:setValue(eg:getParameter("AttackTime"))\n'
    + '  attack.changed = function(self)\n'
    + '    eg:setParameter("AttackTime", self.value)\n'
    + '  end\n'
    ;

    this.attackInitWithCustomKnob =
      ''
    ;

    this.decayInit =
      '  decay = Knob("Decay", 0, 0, 4)\n'
    + '  decay.pos = {<X>, <Y>}\n'
    + '  decay.mapper = Mapper.Quartic\n'
    + '  decay.unit = Unit.Seconds\n'
    + '  decay:setValue(eg:getParameter("DecayTime"))\n'
    + '  decay.changed = function(self)\n'
    + '    eg:setParameter("DecayTime", self.value)\n'
    + '  end\n'
    ;

    this.decayInitWithCustomKnob =
    ''
    ;

    this.sustainInit =
      '  sustain = Knob("Sustain", 1, 0, 1)\n'
    + '  sustain.pos = {<X>, <Y>}\n'
    + '  sustain.mapper = Mapper.Linear\n'
    + '  sustain.unit = Unit.PercentNormalized\n'
    + '  sustain:setValue(eg:getParameter("SustainLevel"))\n'
    + '  sustain.changed = function(self)\n'
    + '    eg:setParameter("SustainLevel", self.value)\n'
    + '  end\n'
    ;

    this.sustainInitWithCustomKnob =
    ''
    ;

    this.releaseInit =
      '  release = Knob("Release", 0.1, 0, 4)\n'
    + '  release.pos = {<X>, <Y>}\n'
    + '  release.mapper = Mapper.Quartic'
    + '  release.unit = Unit.Seconds\n'
    + '  release:setValue(eg:getParameter("ReleaseTime"))\n'
    + '  release.changed = function(self)\n'
    + '    eg:setParameter("ReleaseTime", self.value)\n'
    + '  end\n'
    ;

    this.releaseInitWithCustomKnob =
    ''
    ;


    // ---------------------

    this.lpfInit =
      '  { Note: To use Lpf, set Lpf Fx into slot 0 of Instrument Insert Fx. }\n'
    + '  declare ui_knob $CutOff(0, 1000000, 1)\n'
    + '  move_control_px($CutOff, <X>, <Y>)\n' 
    + '  set_knob_unit($CutOff, $KNOB_UNIT_HZ)\n'
    + '  set_knob_defval($CutOff, 500000)\n'
    + '  $CutOff := get_engine_par($ENGINE_PAR_CUTOFF, $instrument, 0, $insert)\n'
    + '  set_knob_label($CutOff, get_engine_par_disp($ENGINE_PAR_CUTOFF, $instrument, 0, $insert))\n'
    + '\n'
    + '  declare ui_knob $Reso(0, 1000000, 1)\n'
    + '  move_control_px($Reso, <X>, <Y>)\n' 
    + '  set_knob_unit($Reso, $KNOB_UNIT_PERCENT)\n' 
    + '  set_knob_defval($Reso, 0)\n'
    + '  $Reso := get_engine_par($ENGINE_PAR_RESONANCE, $instrument, 0, $insert)\n'
    + '  set_knob_label($Reso, get_engine_par_disp($ENGINE_PAR_RESONANCE, $instrument, 0, $insert))\n';

    this.lpfCallback =
      'on ui_control ($CutOff)\n'
    + '  set_engine_par($ENGINE_PAR_CUTOFF, $CutOff, $instrument, 0, $insert)\n'
    + '  set_knob_label($CutOff, get_engine_par_disp($ENGINE_PAR_CUTOFF, $instrument, 0, $insert))\n'
    + 'end on\n'
    + '\n'
    + 'on ui_control ($Reso)\n'
    + '  set_engine_par($ENGINE_PAR_RESONANCE, $Reso, $instrument, 0, $insert)\n'
    + '  set_knob_label($Reso, get_engine_par_disp($ENGINE_PAR_RESONANCE, $instrument, 0, $insert))\n'
    + 'end on\n';

    this.lpfInitWithCustomKnob =
      '  { Note: To use Lpf, set Lpf Fx into slot 0 of Instrument Insert Fx. }\n'
    + '  declare ui_slider $CutOff(0, 1000000)\n'
    + '  move_control_px($CutOff, <X>, <Y>)\n'
    + '  set_control_par_str(get_ui_id($CutOff), $CONTROL_PAR_TEXT, "")\n'
    + '  set_control_par_str(get_ui_id($CutOff), $CONTROL_PAR_PICTURE, "<KNOB_IMAGE>")\n'
    + '  set_control_par(get_ui_id($CutOff), $CONTROL_PAR_MOUSE_BEHAVIOUR, -500)\n'
    + '  $CutOff := get_engine_par($ENGINE_PAR_CUTOFF, $instrument, 0, $insert)\n'
    + '  set_knob_defval($CutOff, 500000)\n'
    + '\n'
    + '  declare ui_slider $Reso(0, 1000000)\n'
    + '  move_control_px($Reso, <X>, <Y>)\n'
    + '  set_control_par_str(get_ui_id($Reso), $CONTROL_PAR_TEXT, "")\n'
    + '  set_control_par_str(get_ui_id($Reso), $CONTROL_PAR_PICTURE, "<KNOB_IMAGE>")\n'
    + '  set_control_par(get_ui_id($Reso), $CONTROL_PAR_MOUSE_BEHAVIOUR, -500)\n'
    + '  $Reso := get_engine_par($ENGINE_PAR_RESONANCE, $instrument, 0, $insert)\n'
    + '  set_knob_defval($Reso, 0)\n'
    ;

    this.lpfCallbackWithCustomKnob =
      'on ui_control ($CutOff)\n'
    + '  set_engine_par($ENGINE_PAR_CUTOFF, $CutOff, $instrument, 0, $insert)\n'
    + 'end on\n'
    + '\n'
    + 'on ui_control ($Reso)\n'
    + '  set_engine_par($ENGINE_PAR_RESONANCE, $Reso, $instrument, 0, $insert)\n'
    + 'end on\n';


    // ---------------------

    this.reverbInit =
      '  declare const $send_slot := 7\n'
    + '\n'
    + '  { Note: To use Reverb, set Reverb Fx into slot 0 of Instrument Send Fx. }\n'
    + '  declare ui_knob $Reverb(0, 1000000, 1)\n'
    + '  move_control_px($Reverb, <X>, <Y>)\n' 
    + '  set_knob_unit($Reverb, $KNOB_UNIT_DB)\n' 
    + '  set_knob_defval($Reverb, 630859) { 630859 = 0dB }\n'
    + '  $Reverb := get_engine_par($ENGINE_PAR_SENDLEVEL_0, $instrument, $send_slot, $insert)\n'
    + '  set_knob_label($Reverb, get_engine_par_disp($ENGINE_PAR_SENDLEVEL_0, $instrument, $send_slot, $insert))\n'
    + '\n'
    + '  declare ui_knob $Size(0, 1000000, 1)\n'
    + '  move_control_px($Size, <X>, <Y>)\n' 
    + '  set_knob_unit($Size, $KNOB_UNIT_PERCENT)\n' 
    + '  set_knob_defval($Size, 500000)\n'
    + '  $Size := get_engine_par($ENGINE_PAR_RV2_SIZE, $instrument, 0, $send)\n'
    + '  set_knob_label($Size, get_engine_par_disp($ENGINE_PAR_RV2_SIZE, $instrument, 0, $send))\n';

    this.reverbCallback =
      'on ui_control ($Reverb)\n'
    + '  set_engine_par($ENGINE_PAR_SENDLEVEL_0, $Reverb, $instrument, $send_slot, $insert)\n'
    + '  set_knob_label($Reverb, get_engine_par_disp($ENGINE_PAR_SENDLEVEL_0, $instrument, $send_slot, $insert))\n'
    + 'end on\n'
    + '\n'
    + 'on ui_control ($Size)\n'
    + '  set_engine_par($ENGINE_PAR_RV2_SIZE, $Size, $instrument, 0, $send)\n'
    + '  set_knob_label($Size, get_engine_par_disp($ENGINE_PAR_RV2_SIZE, $instrument, 0, $send))\n'
    + 'end on\n';

    this.reverbInitWithCustomKnob =
    '  declare const $send_slot := 7\n'
    + '\n'
    + '  { Note: To use Reverb, set Reverb Fx into slot 0 of Instrument Send Fx. }\n'
    + '  declare ui_slider $Reverb(0, 1000000)\n'
    + '  move_control_px($Reverb, <X>, <Y>)\n'
    + '  set_control_par_str(get_ui_id($Reverb), $CONTROL_PAR_TEXT, "")\n'
    + '  set_control_par_str(get_ui_id($Reverb), $CONTROL_PAR_PICTURE, "<KNOB_IMAGE>")\n'
    + '  set_control_par(get_ui_id($Reverb), $CONTROL_PAR_MOUSE_BEHAVIOUR, -500)\n'
    + '  $Reverb := get_engine_par($ENGINE_PAR_CUTOFF, $instrument, $send_slot, $insert)\n'
    + '  set_knob_defval($Reverb, 630859) { 630859 = 0dB }\n'
    + '\n'
    + '  declare ui_slider $Size(0, 1000000)\n'
    + '  move_control_px($Size, <X>, <Y>)\n'
    + '  set_control_par_str(get_ui_id($Size), $CONTROL_PAR_TEXT, "")\n'
    + '  set_control_par_str(get_ui_id($Size), $CONTROL_PAR_PICTURE, "<KNOB_IMAGE>")\n'
    + '  set_control_par(get_ui_id($Size), $CONTROL_PAR_MOUSE_BEHAVIOUR, -500)\n'
    + '  $Size := get_engine_par($ENGINE_PAR_RV2_SIZE, $instrument, 0, $send)\n'
    + '  set_knob_defval($Size, 500000)\n'
    ;

    this.reverbCallbackWithCustomKnob =
    'on ui_control ($Reverb)\n'
    + '  set_engine_par($ENGINE_PAR_SENDLEVEL_0, $Reverb, $instrument, $send_slot, $insert)\n'
    + 'end on\n'
    + '\n'
    + 'on ui_control ($Size)\n'
    + '  set_engine_par($ENGINE_PAR_RV2_SIZE, $Size, $instrument, 0, $send)\n'
    + 'end on\n';


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
      console.log('cache hit');
      return this.code;
    }

    let init = this.initHead
      .replace('<PANEL_IMAGE>', this.params.panel_image.replace(/\..+$/, ''))
      .replace('<HEIGHT>', this.params.panel_height)
      .replace('<WIDTH>', this.params.panel_width)
      ;

    if (this.params.knob_type === 'default') {
      // default knob
      if (this.params.volume) {
        init += this.volumeInit.replace('<X>', this.params.volume_x).replace('<Y>', this.params.volume_y) + '\n\n';
      }
      if ( this.params.attack
        || this.params.decay
        || this.params.sustain
        || this.params.release
      ) {
        init += this.egInitHead;
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
      if ( this.params.attack
        || this.params.decay
        || this.params.sustain
        || this.params.release
      ) {
        init += this.egInitTail;
      }

      if (this.params.lpf) {
        let x100 = Number(this.params.lpf_x) + 100;
        init += this.lpfInit.replace('<X>', this.params.lpf_x).replace('<Y>', this.params.lpf_y)
          .replace('<X>', x100).replace('<Y>', this.params.lpf_y)
          + '\n\n';
      }
      if (this.params.reverb) {
        let x100 = Number(this.params.reverb_x) + 100;
        init += this.reverbInit.replace('<X>', this.params.reverb_x).replace('<Y>', this.params.reverb_y)
          .replace('<X>', x100).replace('<Y>', this.params.reverb_y)
          + '\n\n';
      }

    } else {
      // custom knob
      let knob_image = this.params.knob_image.replace(/\..+$/, '');
      if (this.params.volume) {
        init += this.volumeInitWithCustomKnob
        .replace('<X>', this.params.volume_x).replace('<Y>', this.params.volume_y) + '\n\n';
      }
      if (this.params.attack) {
        init += this.attackInitWithCustomKnob
        .replace('<X>', this.params.attack_x).replace('<Y>', this.params.attack_y) + '\n\n';
      }
      if (this.params.decay) {
        init += this.decayInitWithCustomKnob
        .replace('<X>', this.params.decay_x).replace('<Y>', this.params.decay_y) + '\n\n';
      }
      if (this.params.sustain) {
        init += this.sustainInitWithCustomKnob
        .replace('<X>', this.params.sustain_x).replace('<Y>', this.params.sustain_y) + '\n\n';
      }
      if (this.params.release) {
        init += this.releaseInitWithCustomKnob
        .replace('<X>', this.params.release_x).replace('<Y>', this.params.release_y) + '\n\n';
      }
      if (this.params.lpf) {
        let x100 = Number(this.params.lpf_x) + 100;
        init += this.lpfInitWithCustomKnob
        .replace('<X>', this.params.reverb_x).replace(/<Y>/g, this.params.reverb_y)
        .replace('<X>', x100) + '\n\n';
      }
      if (this.params.reverb) {
        let x100 = Number(this.params.reverb_x) + 100;
        init += this.reverbInitWithCustomKnob
        .replace('<X>', this.params.reverb_x).replace(/<Y>/g, this.params.reverb_y)
        .replace('<X>', x100) + '\n\n';
      }
    }

    init = init
    .replace(/<KNOB_IMAGE>/g, this.params.knob_image);

    this.code = init + '\n\n';
    this.code = this.code.replace(/\n\n\n+/g, '\n\n');

    return this.code;
  }
}


export default UviBuilder;
