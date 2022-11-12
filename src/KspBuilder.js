class KspBuilder {
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
      'on init\n'
    + '  set_ui_height_px(<HEIGHT>)\n'
    + '  set_ui_width_px(<WIDTH>)\n'
    + '  make_perfview\n'
    + '  set_script_title("<TITLE>")\n'
    + '  set_control_par_str($INST_WALLPAPER_ID, $CONTROL_PAR_PICTURE, "<PANEL_IMAGE>")\n'
    + '  set_skin_offset(0)\n'
    + '\n'
    ;

    this.initIcon =
      '  { Note: Icon image size: 33px x 34px }\n'
    + '  set_control_par_str($INST_ICON_ID, $CONTROL_PAR_PICTURE, "<ICON_IMAGE>")\n'
    ;

    this.initHeadForGUI = 
      '  declare $group\n'
    + '  $group := find_group("Group 1")\n'
    + '  declare const $instrument := -1\n'
    + '  declare const $insert := -1\n'
    + '  declare const $send := 0\n'
    + '\n'
    ;

    this.initHeadForGUIWithCustomKnob = 
      '  { Note: To use custom knob, setup a resource container and meta files. }\n';

    this.initTail = 
      '  message("")\n'
    + 'end on\n';

    // ---------------------

    this.volumeInit =
      '  declare ui_knob $Volume(0, 1000000, 1)\n'
    + '  move_control_px($Volume, <X>, <Y>)\n' 
    + '  set_knob_unit($Volume, $KNOB_UNIT_DB)\n' 
    + '  set_knob_defval($Volume, 500000)  { Note: 500000 = -6dB, 630859 = 0dB }\n'
    + '  $Volume := get_engine_par($ENGINE_PAR_VOLUME, $group, -1, $insert)\n'
    + '  set_knob_label($Volume, get_engine_par_disp($ENGINE_PAR_VOLUME, $group, -1, $insert))\n';

    this.volumeCallback =
      'on ui_control ($Volume)\n'
    + '  set_engine_par($ENGINE_PAR_VOLUME, $Volume, $group, -1, $insert)\n'
    + '  set_knob_label($Volume, get_engine_par_disp($ENGINE_PAR_VOLUME, $group, -1, $insert))\n'
    + 'end on\n';

    this.volumeInitWithCustomKnob =
      '  declare ui_slider $Volume(0, 1000000)\n'
    + '  move_control_px($Volume, <X>, <Y>)\n'
    + '  set_control_par_str(get_ui_id($Volume), $CONTROL_PAR_TEXT, "")\n'
    + '  set_control_par_str(get_ui_id($Volume), $CONTROL_PAR_PICTURE, "<KNOB_IMAGE>")\n'
    + '  set_control_par(get_ui_id($Volume), $CONTROL_PAR_MOUSE_BEHAVIOUR, -500)\n'
    + '  $Volume := get_engine_par($ENGINE_PAR_VOLUME, $group, -1, $insert)\n'
    + '  set_knob_defval($Volume, 500000)  { Note: 500000 = -6dB, 630859 = 0dB }\n'
    ;

    this.volumeCallbackWithCustomKnob =
      'on ui_control ($Volume)\n'
    + '  set_engine_par($ENGINE_PAR_VOLUME, $Volume, $group, -1, $insert)\n'
    + 'end on\n';

    // ---------------------

    this.attackInit =
      '  declare ui_knob $Attack(0, 1000000, 1)\n'
    + '  move_control_px($Attack, <X>, <Y>)\n' 
    + '  set_knob_unit($Attack, $KNOB_UNIT_MS)\n' 
    + '  set_knob_defval($Attack, 0)\n'
    + '  $Attack := get_engine_par($ENGINE_PAR_ATTACK, $group, 0, $insert)\n'
    + '  set_knob_label($Attack, get_engine_par_disp($ENGINE_PAR_ATTACK, $group, 0, $insert))\n';

    this.attackCallback =
      'on ui_control ($Attack)\n'
    + '  set_engine_par($ENGINE_PAR_ATTACK, $Attack, $group, 0, $insert)\n'
    + '  set_knob_label($Attack, get_engine_par_disp($ENGINE_PAR_ATTACK, $group, 0, $insert))\n'
    + 'end on\n';

    this.attackInitWithCustomKnob =
      '  declare ui_slider $Attack(0, 1000000)\n'
    + '  move_control_px($Attack, <X>, <Y>)\n'
    + '  set_control_par_str(get_ui_id($Attack), $CONTROL_PAR_TEXT, "")\n'
    + '  set_control_par_str(get_ui_id($Attack), $CONTROL_PAR_PICTURE, "<KNOB_IMAGE>")\n'
    + '  set_control_par(get_ui_id($Attack), $CONTROL_PAR_MOUSE_BEHAVIOUR, -500)\n'
    + '  $Attack := get_engine_par($ENGINE_PAR_ATTACK, $group, 0, $insert)\n'
    + '  set_knob_defval($Attack, 0)\n'
    ;

    this.attackCallbackWithCustomKnob =
      'on ui_control ($Attack)\n'
    + '  set_engine_par($ENGINE_PAR_ATTACK, $Attack, $group, -1, $insert)\n'
    + 'end on\n';


    this.decayInit =
      '  declare ui_knob $Decay(0, 1000000, 1)\n'
    + '  move_control_px($Decay, <X>, <Y>)\n' 
    + '  set_knob_unit($Decay, $KNOB_UNIT_MS)\n' 
    + '  set_knob_defval($Decay, 0)\n'
    + '  $Decay := get_engine_par($ENGINE_PAR_DECAY, $group, 0, $insert)\n'
    + '  set_knob_label($Decay, get_engine_par_disp($ENGINE_PAR_DECAY, $group, 0, $insert))\n';

    this.decayCallback =
      'on ui_control ($Decay)\n'
    + '  set_engine_par($ENGINE_PAR_DECAY, $Decay, $group, 0, $insert)\n'
    + '  set_knob_label($Decay, get_engine_par_disp($ENGINE_PAR_DECAY, $group, 0, $insert))\n'
    + 'end on\n';

    this.decayInitWithCustomKnob =
      '  declare ui_slider $Decay(0, 1000000)\n'
    + '  move_control_px($Decay, <X>, <Y>)\n'
    + '  set_control_par_str(get_ui_id($Decay), $CONTROL_PAR_TEXT, "")\n'
    + '  set_control_par_str(get_ui_id($Decay), $CONTROL_PAR_PICTURE, "<KNOB_IMAGE>")\n'
    + '  set_control_par(get_ui_id($Decay), $CONTROL_PAR_MOUSE_BEHAVIOUR, -500)\n'
    + '  $Decay := get_engine_par($ENGINE_PAR_DECAY, $group, 0, $insert)\n'
    + '  set_knob_defval($Decay, 0)\n'
    ;

    this.decayCallbackWithCustomKnob =
      'on ui_control ($Decay)\n'
    + '  set_engine_par($ENGINE_PAR_DECAY, $Decay, $group, -1, $insert)\n'
    + 'end on\n';


    this.sustainInit =
      '  declare ui_knob $Sustain(0, 1000000, 1)\n'
    + '  move_control_px($Sustain, <X>, <Y>)\n' 
    + '  set_knob_unit($Sustain, $KNOB_UNIT_DB)\n' 
    + '  set_knob_defval($Sustain, 1000000)\n'
    + '  $Sustain := get_engine_par($ENGINE_PAR_SUSTAIN, $group, 0, $insert)\n'
    + '  set_knob_label($Sustain, get_engine_par_disp($ENGINE_PAR_SUSTAIN, $group, 0, $insert))\n';

    this.sustainCallback =
      'on ui_control ($Sustain)\n'
    + '  set_engine_par($ENGINE_PAR_SUSTAIN, $Sustain, $group, 0, $insert)\n'
    + '  set_knob_label($Sustain, get_engine_par_disp($ENGINE_PAR_SUSTAIN, $group, 0, $insert))\n'
    + 'end on\n';

    this.sustainInitWithCustomKnob =
      '  declare ui_slider $Sustain(0, 1000000)\n'
    + '  move_control_px($Sustain, <X>, <Y>)\n'
    + '  set_control_par_str(get_ui_id($Sustain), $CONTROL_PAR_TEXT, "")\n'
    + '  set_control_par_str(get_ui_id($Sustain), $CONTROL_PAR_PICTURE, "<KNOB_IMAGE>")\n'
    + '  set_control_par(get_ui_id($Sustain), $CONTROL_PAR_MOUSE_BEHAVIOUR, -500)\n'
    + '  $Sustain := get_engine_par($ENGINE_PAR_SUSTAIN, $group, 0, $insert)\n'
    + '  set_knob_defval($Sustain, 1000000)\n'
    ;

    this.sustainCallbackWithCustomKnob =
      'on ui_control ($Sustain)\n'
    + '  set_engine_par($ENGINE_PAR_SUSTAIN, $Sustain, $group, -1, $insert)\n'
    + 'end on\n';


    this.releaseInit =
      '  declare ui_knob $Release(0, 1000000, 1)\n'
    + '  move_control_px($Release, <X>, <Y>)\n' 
    + '  set_knob_unit($Release, $KNOB_UNIT_MS)\n' 
    + '  set_knob_defval($Release, 664063) { Note: 664063 = 1.0sec }\n'
    + '  $Release := get_engine_par($ENGINE_PAR_RELEASE, $group, 0, $insert)\n'
    + '  set_knob_label($Release, get_engine_par_disp($ENGINE_PAR_RELEASE, $group, 0, $insert))\n';

    this.releaseCallback =
      'on ui_control ($Release)\n'
    + '  set_engine_par($ENGINE_PAR_RELEASE, $Release, $group, 0, $insert)\n'
    + '  set_knob_label($Release, get_engine_par_disp($ENGINE_PAR_RELEASE, $group, 0, $insert))\n'
    + 'end on\n';

    this.releaseInitWithCustomKnob =
      '  declare ui_slider $Release(0, 1000000)\n'
    + '  move_control_px($Release, <X>, <Y>)\n'
    + '  set_control_par_str(get_ui_id($Release), $CONTROL_PAR_TEXT, "")\n'
    + '  set_control_par_str(get_ui_id($Release), $CONTROL_PAR_PICTURE, "<KNOB_IMAGE>")\n'
    + '  set_control_par(get_ui_id($Release), $CONTROL_PAR_MOUSE_BEHAVIOUR, -500)\n'
    + '  $Release := get_engine_par($ENGINE_PAR_RELEASE, $group, 0, $insert)\n'
    + '  set_knob_defval($Release, 664063) { Note: 664063 = 1.0sec }\n'
    ;

    this.releaseCallbackWithCustomKnob =
      'on ui_control ($Release)\n'
    + '  set_engine_par($ENGINE_PAR_RELEASE, $Release, $group, -1, $insert)\n'
    + 'end on\n';

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
      .replace('<TITLE>', this.params.script_title)
      .replace('<HEIGHT>', this.params.panel_height)
      .replace('<WIDTH>', this.params.panel_width)
      ;
    if (this.params.icon) {
      init += this.initIcon.replace('<ICON_IMAGE>', this.params.icon_image.replace(/\..+$/, '')) + '\n';
    }

    if ( this.params.volume
      || this.params.attack
      || this.params.decay
      || this.params.sustain
      || this.params.release
      || this.params.lpf
      || this.params.reverb
    ) {
      init += this.initHeadForGUI;
      if (this.params.knob_type === 'custom') {
        init += this.initHeadForGUIWithCustomKnob;
      }
    }

    let callbacks = '';

    if (this.params.knob_type === 'default') {
      // default knob
      if (this.params.volume) {
        init += this.volumeInit.replace('<X>', this.params.volume_x).replace('<Y>', this.params.volume_y) + '\n\n';
        callbacks += this.volumeCallback + '\n\n';
      }
      if (this.params.attack) {
        init += this.attackInit.replace('<X>', this.params.attack_x).replace('<Y>', this.params.attack_y) + '\n\n';
        callbacks += this.attackCallback + '\n\n';
      }
      if (this.params.decay) {
        init += this.decayInit.replace('<X>', this.params.decay_x).replace('<Y>', this.params.decay_y) + '\n\n';
        callbacks += this.decayCallback + '\n\n';
      }
      if (this.params.sustain) {
        init += this.sustainInit.replace('<X>', this.params.sustain_x).replace('<Y>', this.params.sustain_y) + '\n\n';
        callbacks += this.sustainCallback + '\n\n';
      }
      if (this.params.release) {
        init += this.releaseInit.replace('<X>', this.params.release_x).replace('<Y>', this.params.release_y) + '\n\n';
        callbacks += this.releaseCallback + '\n\n';
      }
      if (this.params.lpf) {
        let x100 = Number(this.params.lpf_x) + 100;
        init += this.lpfInit.replace('<X>', this.params.lpf_x).replace('<Y>', this.params.lpf_y)
          .replace('<X>', x100).replace('<Y>', this.params.lpf_y)
          + '\n\n';
        callbacks += this.lpfCallback + '\n\n';
      }
      if (this.params.reverb) {
        let x100 = Number(this.params.reverb_x) + 100;
        init += this.reverbInit.replace('<X>', this.params.reverb_x).replace('<Y>', this.params.reverb_y)
          .replace('<X>', x100).replace('<Y>', this.params.reverb_y)
          + '\n\n';
        callbacks += this.reverbCallback + '\n\n';
      }

    } else {
      // custom knob
      let knob_image = this.params.knob_image.replace(/\..+$/, '');
      if (this.params.volume) {
        init += this.volumeInitWithCustomKnob
        .replace('<X>', this.params.volume_x).replace('<Y>', this.params.volume_y)
        .replace('<KNOB_IMAGE>', knob_image) + '\n\n';
        callbacks += this.volumeCallbackWithCustomKnob + '\n\n';
      }
      if (this.params.attack) {
        init += this.attackInitWithCustomKnob
        .replace('<X>', this.params.attack_x).replace('<Y>', this.params.attack_y)
        .replace('<KNOB_IMAGE>', knob_image) + '\n\n';
        callbacks += this.attackCallbackWithCustomKnob + '\n\n';
      }
      if (this.params.decay) {
        init += this.decayInitWithCustomKnob
        .replace('<X>', this.params.decay_x).replace('<Y>', this.params.decay_y)
        .replace('<KNOB_IMAGE>', knob_image) + '\n\n';
        callbacks += this.decayCallbackWithCustomKnob + '\n\n';
      }
      if (this.params.sustain) {
        init += this.sustainInitWithCustomKnob.replace('<X>', this.params.sustain_x)
        .replace('<Y>', this.params.sustain_y)
        .replace('<KNOB_IMAGE>', knob_image) + '\n\n';
        callbacks += this.sustainCallbackWithCustomKnob + '\n\n';
      }
      if (this.params.release) {
        init += this.releaseInitWithCustomKnob
        .replace('<X>', this.params.release_x).replace('<Y>', this.params.release_y)
        .replace('<KNOB_IMAGE>', knob_image) + '\n\n';
        callbacks += this.releaseCallbackWithCustomKnob + '\n\n';
      }
      if (this.params.lpf) {
        let x100 = Number(this.params.lpf_x) + 100;
        init += this.lpfInitWithCustomKnob
        .replace('<X>', this.params.lpf_x).replace('<Y>', this.params.lpf_y)
        .replace('<X>', x100).replace('<Y>', this.params.lpf_y)
        .replace('<KNOB_IMAGE>', knob_image)
        .replace('<KNOB_IMAGE>', knob_image) + '\n\n';
        callbacks += this.lpfCallbackWithCustomKnob + '\n\n';
      }
      if (this.params.reverb) {
        let x100 = Number(this.params.reverb_x) + 100;
        init += this.reverbInitWithCustomKnob
        .replace('<X>', this.params.reverb_x).replace('<Y>', this.params.reverb_y)
        .replace('<X>', x100).replace('<Y>', this.params.reverb_y)
        .replace('<KNOB_IMAGE>', knob_image)
        .replace('<KNOB_IMAGE>', knob_image) + '\n\n';
        callbacks += this.reverbCallbackWithCustomKnob + '\n\n';
      }
    }

    init += '\n\n' + this.initTail;

    this.code = init + '\n\n' + callbacks;
    this.code = this.code.replace(/\n\n\n+/g, '\n\n');

    return this.code;
  }
}


export default KspBuilder;
