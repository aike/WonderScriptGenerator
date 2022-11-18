class SKspBuilder {
  constructor() {
    this.code = '';
    this.params = {
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
      reverb_y: '120'
    }

    this.initHead = 
      'on init\n'
    + '  const generic\n'
    + '    INSERT_FX := -1\n'
    + '    SEND_FX := 0\n'
    + '  end const\n'
    + '\n'
    + '  const slot\n'
    + '    NO_SLOT := -1\n'
    + '    SLOT_0 := 0\n'
    + '    SLOT_7 := 7\n'
    + '  end const\n'
    + '\n'
    + '  declare group := find_group("Group 1")\n'
    + '  declare const instrument := -1\n'
    + '\n'
    + '  setPanel(<WIDTH>, <HEIGHT>, "main", "mypanel")\n'
    + '\n'
    ;

    this.panelMacro = 
      'macro setPanel(#w#, #h#, #title#, #image#)\n'
    + '  set_ui_width_px(#w#)\n'
    + '  set_ui_height_px(#h#)\n'
    + '  set_script_title(#title#)\n'
    + '  set_control_par_str(INST_WALLPAPER_ID, CONTROL_PAR_PICTURE, #image#)\n'
    + '  set_skin_offset(0)\n'
    + '  make_perfview\n'
    + 'end macro\n'
    + '\n'

    this.initIcon =
      '  // Note: Icon image size: 33px x 34px\n'
    + '  setIcon("<ICON_IMAGE>")\n'
    + '\n'
    ;

    this.iconMacro = 
      'macro setIcon(#image#)\n'
    + '  set_control_par_str(INST_ICON_ID, CONTROL_PAR_PICTURE, #image#)\n'
    + 'end macro\n'
    + '\n'
    ;

    this.initHeadForGUIWithCustomKnob = 
      '  // Note: To use custom knob, setup a resource container and meta files.\n';

    this.initTail = 
      '  message("")\n'
    + 'end on\n';

    // ---------------------

    this.knobMacro =
        'macro addKnob(#knob#, #x#, #y#, #defval#, #unit#, #par#, #g#, #s#, #i#)\n'
      + '  declare ui_knob #knob#(0, 1000000, 1)\n'
      + '  move_control_px(#knob#, #x#, #y#)\n'
      + '  set_knob_unit(#knob#, KNOB_UNIT_#unit#)\n'
      + '  set_knob_defval(#knob#, #defval#)\n'
      + '  #knob# := get_engine_par(ENGINE_PAR_#par#, #g#, #s#, #i#)\n'
      + '  set_knob_label(#knob#, get_engine_par_disp(ENGINE_PAR_#par#, #g#, #s#, #i#))\n'
      + 'end macro\n'
      + '\n'
      ;

    this.knobMacroWithCustomKnob =
      'macro addKnob(#knob#, #x#, #y#, #defval#, #unit#, #par#, #g#, #s#, #i#, #image#)\n'
    + '  declare ui_slider #knob#(0, 1000000)\n'
    + '  move_control_px(#knob#, #x#, #y#)\n'
    + '  set_control_par_str(get_ui_id(#knob#), CONTROL_PAR_TEXT, "")\n'
    + '  set_control_par_str(get_ui_id(#knob#), CONTROL_PAR_PICTURE, #image#)\n'
    + '  set_control_par(get_ui_id(#knob#), CONTROL_PAR_MOUSE_BEHAVIOUR, -500)\n'
    + '  #knob# := get_engine_par(ENGINE_PAR_#par#, #g#, #s#, #i#)\n'
    + '  set_control_par(get_ui_id(#knob#), CONTROL_PAR_DEFAULT_VALUE, #defval#)\n'
    + '  end macro\n'
    + '\n'
    ;

    this.knobCallbackMacro = 
      'macro knobCallback(#knob#, #par#, #g#, #s#, #i#)\n'
    + '  on ui_control(#knob#)\n'
    + '    set_engine_par(ENGINE_PAR_#par#, #knob#, #g#, #s#, #i#)\n'
    + '    set_knob_label(#knob#, get_engine_par_disp(ENGINE_PAR_#par#, #g#, #s#, #i#))\n'
    + '  end on\n'
    + 'end macro\n'
    + '\n'
    ;

    this.knobCallbackMacroWithCustomKnob = 
      'macro knobCallback(#knob#, #par#, #g#, #s#, #i#)\n'
    + '  on ui_control(#knob#)\n'
    + '    set_engine_par(ENGINE_PAR_#par#, #knob#, #g#, #s#, #i#)\n'
    + '  end on\n'
    + 'end macro\n'
    + '\n'
    ;

    // ---------------------

    this.volumeInit =
      '  // Note: 500000 = -6dB, 630859 = 0dB\n'
    + '  addKnob(Volume, <X>, <Y>, 500000, DB, VOLUME, group, slot.NO_SLOT, generic.INSERT_FX)\n';
    this.volumeInitWithCustomKnob =
      '  // Note: 500000 = -6dB, 630859 = 0dB\n'
    + '  addKnob(Volume, <X>, <Y>, 500000, DB, VOLUME, group, slot.NO_SLOT, generic.INSERT_FX, "<KNOB_IMAGE>")\n';
    this.volumeCallback =
      'knobCallback(Volume, VOLUME, group, slot.NO_SLOT, generic.INSERT_FX)\n';

    // ---------------------

    this.attackInit =
      '  addKnob(Attack, <X>, <Y>, 0, MS, ATTACK, group, slot.SLOT_0, generic.INSERT_FX)\n';
    this.attackInitWithCustomKnob =
      '  addKnob(Attack, <X>, <Y>, 0, MS, ATTACK, group, slot.SLOT_0, generic.INSERT_FX, "<KNOB_IMAGE>")\n';
    this.attackCallback =
      'knobCallback(Attack, ATTACK, group, slot.SLOT_0, generic.INSERT_FX)\n';

    this.decayInit =
      '  addKnob(Decay, <X>, <Y>, 0, MS, DECAY, group, slot.SLOT_0, generic.INSERT_FX)\n';
    this.decayInitWithCustomKnob =
      '  addKnob(Decay, <X>, <Y>, 0, MS, DECAY, group, slot.SLOT_0, generic.INSERT_FX, "<KNOB_IMAGE>")\n';
    this.decayCallback =
      'knobCallback(Decay, DECAY, group, slot.SLOT_0, generic.INSERT_FX)\n';

    this.sustainInit =
      '  addKnob(Sustain, <X>, <Y>, 1000000, DB, SUSTAIN, group, slot.SLOT_0, generic.INSERT_FX)\n';
      this.sustainInitWithCustomKnob =
      '  addKnob(Sustain, <X>, <Y>, 1000000, DB, SUSTAIN, group, slot.SLOT_0, generic.INSERT_FX, "<KNOB_IMAGE>")\n';
    this.sustainCallback =
      'knobCallback(Sustain, SUSTAIN, group, slot.SLOT_0, generic.INSERT_FX)\n';

    this.releaseInit =
      '  // Note: 664063 = 1.0sec\n'
    + '  addKnob(Release, <X>, <Y>, 664063, MS, RELEASE, group, slot.SLOT_0, generic.INSERT_FX)\n'
    this.releaseInitWithCustomKnob =
      '  // Note: 664063 = 1.0sec\n'
    + '  addKnob(Release, <X>, <Y>, 664063, MS, RELEASE, group, slot.SLOT_0, generic.INSERT_FX, "<KNOB_IMAGE>")\n';
    this.releaseCallback =
      'knobCallback(Release, RELEASE, group, slot.SLOT_0, generic.INSERT_FX)\n';

    // ---------------------

    this.lpfInit =
      '  // Note: To use Lpf, set Lpf Fx into slot 0 of Instrument Insert Fx.\n'
    + '  addKnob(CutOff, <X>, <Y>, 500000, HZ, CUTOFF, instrument, slot.NO_SLOT, generic.INSERT_FX)\n'
    + '  addKnob(Reso, <X>, <Y>, 0, PERCENT, RESONANCE, instrument, slot.NO_SLOT, generic.INSERT_FX)\n';
    this.lpfInitWithCustomKnob =
      '  // Note: To use Lpf, set Lpf Fx into slot 0 of Instrument Insert Fx.\n'
    + '  addKnob(CutOff, <X>, <Y>, 500000, HZ, CUTOFF, instrument, slot.NO_SLOT, generic.INSERT_FX, "<KNOB_IMAGE>")\n'
    + '  addKnob(Reso, <X>, <Y>, 0, PERCENT, RESONANCE, instrument, slot.NO_SLOT, generic.INSERT_FX, "<KNOB_IMAGE>")\n';
    this.lpfCallback =
      'knobCallback(CutOff, CUTOFF, instrument, slot.NO_SLOT, generic.INSERT_FX)\n'
    + 'knobCallback(Reso, RESONANCE, instrument, slot.NO_SLOT, generic.INSERT_FX)\n';

    // ---------------------

    this.reverbInit =
      '  // Note: To use Reverb, set Reverb Fx into slot 0 of Instrument Send Fx.\n'
    + '  addKnob(Reverb, <X>, <Y>, 500000, DB, SENDLEVEL_0, instrument, slot.SLOT_7, generic.INSERT_FX)\n'
    + '  addKnob(Size, <X>, <Y>, 0, PERCENT, RV2_SIZE, instrument, slot.SLOT_0, generic.SEND_FX)\n';
    this.reverbInitWithCustomKnob =
      '  // Note: To use Reverb, set Reverb Fx into slot 0 of Instrument Send Fx.\n'
    + '  addKnob(Reverb, <X>, <Y>, 500000, DB, SENDLEVEL_0, instrument, slot.SLOT_7, generic.INSERT_FX, "<KNOB_IMAGE>")\n'
    + '  addKnob(Size, <X>, <Y>, 0, PERCENT, RV2_SIZE, instrument, slot.SLOT_0, generic.SEND_FX, "<KNOB_IMAGE>")\n';

    this.reverbCallback =
      'knobCallback(Reverb, SENDLEVEL_0, instrument, slot.SLOT_7, generic.INSERT_FX)\n'
    + 'knobCallback(Size, RV2_SIZE, instrument, slot.SLOT_0, generic.SEND_FX)\n';

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
      return this.code;
    }

    let init = this.initHead
      .replace('<PANEL_IMAGE>', this.params.panel_image.replace(/\..+$/, ''))
      .replace('<TITLE>', this.params.script_title)
      .replace('<HEIGHT>', this.params.panel_height)
      .replace('<WIDTH>', this.params.panel_width)
      ;

    let macros = this.panelMacro;
    if (this.params.icon) {
      init += this.initIcon.replace('<ICON_IMAGE>', this.params.icon_image.replace(/\..+$/, '')) + '\n';
      macros += this.iconMacro;
    }

    if ( this.params.volume
      || this.params.attack
      || this.params.decay
      || this.params.sustain
      || this.params.release
      || this.params.lpf
      || this.params.reverb
    ) {
      if (this.params.knob_type === 'default') {
        macros += this.knobMacro + this.knobCallbackMacro;
      } else {
        init += this.initHeadForGUIWithCustomKnob;
        macros += this.knobMacroWithCustomKnob + this.knobCallbackMacroWithCustomKnob;
      }
    }

    let callbacks = '';
    if (this.params.knob_type === 'default') {
      // default knob
      if (this.params.volume) {
        init += this.volumeInit.replace('<X>', this.params.volume_x).replace('<Y>', this.params.volume_y);
        callbacks += this.volumeCallback;
      }
      if (this.params.attack) {
        init += this.attackInit.replace('<X>', this.params.attack_x).replace('<Y>', this.params.attack_y);
        callbacks += this.attackCallback;
      }
      if (this.params.decay) {
        init += this.decayInit.replace('<X>', this.params.decay_x).replace('<Y>', this.params.decay_y);
        callbacks += this.decayCallback;
      }
      if (this.params.sustain) {
        init += this.sustainInit.replace('<X>', this.params.sustain_x).replace('<Y>', this.params.sustain_y);
        callbacks += this.sustainCallback;
      }
      if (this.params.release) {
        init += this.releaseInit.replace('<X>', this.params.release_x).replace('<Y>', this.params.release_y);
        callbacks += this.releaseCallback;
      }
      if (this.params.lpf) {
        let x100 = Number(this.params.lpf_x) + 100;
        init += this.lpfInit.replace('<X>', this.params.lpf_x).replace('<Y>', this.params.lpf_y)
          .replace('<X>', x100).replace('<Y>', this.params.lpf_y);
        callbacks += this.lpfCallback;
      }
      if (this.params.reverb) {
        let x100 = Number(this.params.reverb_x) + 100;
        init += this.reverbInit.replace('<X>', this.params.reverb_x).replace('<Y>', this.params.reverb_y)
          .replace('<X>', x100).replace('<Y>', this.params.reverb_y);
        callbacks += this.reverbCallback;
      }

    } else {
      // custom knob
      let knob_image = this.params.knob_image.replace(/\..+$/, '');
      if (this.params.volume) {
        init += this.volumeInitWithCustomKnob
        .replace('<X>', this.params.volume_x).replace('<Y>', this.params.volume_y);
        callbacks += this.volumeCallback;
      }
      if (this.params.attack) {
        init += this.attackInitWithCustomKnob
        .replace('<X>', this.params.attack_x).replace('<Y>', this.params.attack_y);
        callbacks += this.attackCallback;
      }
      if (this.params.decay) {
        init += this.decayInitWithCustomKnob
        .replace('<X>', this.params.decay_x).replace('<Y>', this.params.decay_y);
        callbacks += this.decayCallback;
      }
      if (this.params.sustain) {
        init += this.sustainInitWithCustomKnob
        .replace('<X>', this.params.sustain_x).replace('<Y>', this.params.sustain_y);
        callbacks += this.sustainCallback;
      }
      if (this.params.release) {
        init += this.releaseInitWithCustomKnob
        .replace('<X>', this.params.release_x).replace('<Y>', this.params.release_y);
        callbacks += this.releaseCallback;
      }
      if (this.params.lpf) {
        let x100 = Number(this.params.lpf_x) + 100;
        init += this.lpfInitWithCustomKnob
        .replace('<X>', this.params.lpf_x).replace(/<Y>/g, this.params.lpf_y)
        .replace('<X>', x100);
        callbacks += this.lpfCallback;
      }
      if (this.params.reverb) {
        let x100 = Number(this.params.reverb_x) + 100;
        init += this.reverbInitWithCustomKnob
        .replace('<X>', this.params.reverb_x).replace(/<Y>/g, this.params.reverb_y)
        .replace('<X>', x100);
        callbacks += this.reverbCallback;
      }
      init = init
      .replace(/<KNOB_IMAGE>/g, knob_image);
    }

    init += '\n\n' + this.initTail;

    this.code = init + '\n\n' + callbacks  + '\n\n' + macros;
    this.code = this.code.replace(/\n\n\n+/g, '\n\n');

    return this.code;
  }
}


export default SKspBuilder;
