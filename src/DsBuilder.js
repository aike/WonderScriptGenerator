class DsBuilder {
  constructor() {
    this.code = "";
    this.params = {
      init: false,
      panel_width: 970,
      panel_height: 300,
      panel_image: "mypanel.png",
      icon_image: "myicon.png",
      volume: false,
      attack: false,
      decay: false,
      sustain: false,
      release: false
    }

    this.initHead = 
      '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<DecentSampler>\n'
    + '  <groups>\n'
    + '     <group>\n'
    + '        <sample rootNote="60" loNote="60" hiNote="72" path="wav/c4.wav" />\n'
    + '     </group>\n'
    + '  </groups>\n'
    + '  <ui bgImage="<PANEL_IMAGE>" width="812" height="375">\n'
    + '    <tab name="main">\n'
    + '\n'
    ;
    
    this.initTail = 
      '    </tab>\n'
    + '  </ui>\n'
    + '</DecentSampler>\n'
    ;

    this.volumeInit =
      '    <labeled-knob x="<X>" y="<Y>"\n'
    + '     width="30" label="VOLUME" textSize="20"\n'
    + '    type="float" minValue="0" maxValue="1" value="0.5">\n'
    + '    <binding type="amp" level="instrument" position="0" parameter="AMP_VOLUME" />\n'
    + '  </labeled-knob>\n'
    ;

    this.attackInit =
      '    <labeled-knob x="<X>" y="<Y>"\n'
    + '    width="30" label="Attack" textSize="20"\n'
    + '    type="float" minValue="0.0" maxValue="4.0" value="0.0">\n'
    + '     <binding type="amp" level="instrument" position="0" parameter="ENV_ATTACK" />\n'
    + '   </labeled-knob>\n'
    ;

    this.decayInit =
      "  declare ui_knob $Decay(0, 1000000, 1)\n"
    + "  move_control_px($Decay, <X>, <Y>)\n" 
    + "  set_knob_unit($Decay, $KNOB_UNIT_MS)\n" 
    + "  set_knob_defval($Decay, 0)\n"
    + "  $Decay := get_engine_par($ENGINE_PAR_DECAY, $grp, 0, -1)\n"
    + "  set_knob_label($Decay, get_engine_par_disp($ENGINE_PAR_DECAY, $grp, 0, -1))\n";

    this.sustainInit =
      "  declare ui_knob $Sustain(0, 1000000, 1)\n"
    + "  move_control_px($Sustain, <X>, <Y>)\n" 
    + "  set_knob_unit($Sustain, $KNOB_UNIT_DB)\n" 
    + "  set_knob_defval($Sustain, 0)\n"
    + "  $Sustain := get_engine_par($ENGINE_PAR_SUSTAIN, $grp, 0, -1)\n"
    + "  set_knob_label($Sustain, get_engine_par_disp($ENGINE_PAR_SUSTAIN, $grp, 0, -1))\n";

    this.releaseInit =
      "  declare ui_knob $Release(0, 1000000, 1)\n"
    + "  move_control_px($Release, <X>, <Y>)\n" 
    + "  set_knob_unit($Release, $KNOB_UNIT_MS)\n" 
    + "  set_knob_defval($Release, 0)\n"
    + "  $Release := get_engine_par($ENGINE_PAR_RELEASE, $grp, 0, -1)\n"
    + "  set_knob_label($Release, get_engine_par_disp($ENGINE_PAR_RELEASE, $grp, 0, -1))\n";

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

    let x = 50;
    let y = 50;

    if (this.params.volume) {
      init += this.volumeInit.replace("<X>", String(x)).replace("<Y>", String(y)) + "\n\n";
      x += 100;
    }
    if (this.params.attack) {
      init += this.attackInit.replace("<X>", String(x)).replace("<Y>", String(y)) + "\n\n";
      x += 100;
    }
    if (this.params.decay) {
      init += this.decayInit.replace("<X>", String(x)).replace("<Y>", String(y)) + "\n\n";
      x += 100;
    }
    if (this.params.sustain) {
      init += this.sustainInit.replace("<X>", String(x)).replace("<Y>", String(y)) + "\n\n";
      x += 100;
    }
    if (this.params.release) {
      init += this.releaseInit.replace("<X>", String(x)).replace("<Y>", String(y)) + "\n\n";
      x += 100;
    }

    init += "\n\n" + this.initTail;

    this.code = init;
    this.code = this.code.replace(/\n\n\n+/g, "\n\n");

    return this.code;
  }
}

export default DsBuilder;
