class KspBuilder {
  constructor() {
    this.code = "";
    this.params = {
      init: false,
      panel_width: "970",
      panel_height: "200",
      panel_image: "mypanel.png",
      icon_image: "myicon.png",
      volume: false,
      attack: false,
      decay: false,
      sustain: false,
      release: false
    }

    this.initHead = 
      "on init\n"
    + "  set_ui_height_px(<HEIGHT>)\n"
    + "  set_ui_width_px(<WIDTH>)\n"
    + "  make_perfview\n"
    + "  set_script_title(\"My Library\")\n"
    + "  set_control_par_str($INST_WALLPAPER_ID, $CONTROL_PAR_PICTURE, \"<PANEL_IMAGE>\")\n"
    + "  set_control_par_str($INST_ICON_ID, $CONTROL_PAR_PICTURE, \"<ICON_IMAGE>\")\n"
    + "  set_skin_offset(0)\n"
    + "\n"
    ;

    this.initHeadForGUI = 
      "  declare $grp\n"
    + "  $grp := find_group(\"Group 1\")\n"
    + "\n"
    ;
    
    this.initTail = 
      "  message (\"\")\n"
    + "end on\n";

    this.volumeInit =
      "  declare ui_knob $Volume(0, 1000000, 1)\n"
    + "  move_control_px($Volume, <X>, <Y>)\n" 
    + "  set_knob_unit($Volume, $KNOB_UNIT_DB)\n" 
    + "  set_knob_defval($Volume, 500000)  { Note: 500000 = -6dB, 630859 = 0dB }\n"
    + "  $Volume := get_engine_par($ENGINE_PAR_VOLUME, $grp, -1, -1)\n"
    + "  set_knob_label($Volume, get_engine_par_disp($ENGINE_PAR_VOLUME, $grp, -1, -1))\n";

    this.volumeCallback =
      "on ui_control ($Volume)\n"
    + "  set_engine_par($ENGINE_PAR_VOLUME, $Volume, $grp, -1, -1)\n"
    + "  set_knob_label($Volume, get_engine_par_disp($ENGINE_PAR_VOLUME, $grp, -1, -1))\n"
    + "end on\n";


    this.attackInit =
      "  declare ui_knob $Attack(0, 1000000, 1)\n"
    + "  move_control_px($Attack, <X>, <Y>)\n" 
    + "  set_knob_unit($Attack, $KNOB_UNIT_MS)\n" 
    + "  set_knob_defval($Attack, 0)\n"
    + "  $Attack := get_engine_par($ENGINE_PAR_ATTACK, $grp, 0, -1)\n"
    + "  set_knob_label($Attack, get_engine_par_disp($ENGINE_PAR_ATTACK, $grp, 0, -1))\n";

    this.attackCallback =
      "on ui_control ($Attack)\n"
    + "  set_engine_par($ENGINE_PAR_ATTACK, $Attack, $grp, 0, -1)\n"
    + "  set_knob_label($Attack, get_engine_par_disp($ENGINE_PAR_ATTACK, $grp, 0, -1))\n"
    + "end on"

    this.decayInit =
      "  declare ui_knob $Decay(0, 1000000, 1)\n"
    + "  move_control_px($Decay, <X>, <Y>)\n" 
    + "  set_knob_unit($Decay, $KNOB_UNIT_MS)\n" 
    + "  set_knob_defval($Decay, 0)\n"
    + "  $Decay := get_engine_par($ENGINE_PAR_DECAY, $grp, 0, -1)\n"
    + "  set_knob_label($Decay, get_engine_par_disp($ENGINE_PAR_DECAY, $grp, 0, -1))\n";

    this.decayCallback =
      "on ui_control ($Decay)\n"
    + "  set_engine_par($ENGINE_PAR_DECAY, $Decay, $grp, 0, -1)\n"
    + "  set_knob_label($Decay, get_engine_par_disp($ENGINE_PAR_DECAY, $grp, 0, -1))\n"
    + "end on"

    this.sustainInit =
      "  declare ui_knob $Sustain(0, 1000000, 1)\n"
    + "  move_control_px($Sustain, <X>, <Y>)\n" 
    + "  set_knob_unit($Sustain, $KNOB_UNIT_DB)\n" 
    + "  set_knob_defval($Sustain, 0)\n"
    + "  $Sustain := get_engine_par($ENGINE_PAR_SUSTAIN, $grp, 0, -1)\n"
    + "  set_knob_label($Sustain, get_engine_par_disp($ENGINE_PAR_SUSTAIN, $grp, 0, -1))\n";

    this.sustainCallback =
      "on ui_control ($Sustain)\n"
    + "  set_engine_par($ENGINE_PAR_SUSTAIN, $Sustain, $grp, 0, -1)\n"
    + "  set_knob_label($Sustain, get_engine_par_disp($ENGINE_PAR_SUSTAIN, $grp, 0, -1))\n"
    + "end on"

    this.releaseInit =
      "  declare ui_knob $Release(0, 1000000, 1)\n"
    + "  move_control_px($Release, <X>, <Y>)\n" 
    + "  set_knob_unit($Release, $KNOB_UNIT_MS)\n" 
    + "  set_knob_defval($Release, 0)\n"
    + "  $Release := get_engine_par($ENGINE_PAR_RELEASE, $grp, 0, -1)\n"
    + "  set_knob_label($Release, get_engine_par_disp($ENGINE_PAR_RELEASE, $grp, 0, -1))\n";

    this.releaseCallback =
      "on ui_control ($Release)\n"
    + "  set_engine_par($ENGINE_PAR_RELEASE, $Release, $grp, 0, -1)\n"
    + "  set_knob_label($Release, get_engine_par_disp($ENGINE_PAR_RELEASE, $grp, 0, -1))\n"
    + "end on"


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
      .replace("<PANEL_IMAGE>", this.params.panel_image.replace(/\..+$/, ""))
      .replace("<ICON_IMAGE>", this.params.icon_image.replace(/\..+$/, ""))
      .replace("<HEIGHT>", this.params.panel_height)
      .replace("<WIDTH>", this.params.panel_width)
      ;
    if ( this.params.volume
      || this.params.attack
      || this.params.decay
      || this.params.sustain
      || this.params.release
    ) {
      init += this.initHeadForGUI;
    }

    let callbacks = "";
    let x = 50;
    let y = 50;

    if (this.params.volume) {
      init += this.volumeInit.replace("<X>", String(x)).replace("<Y>", String(y)) + "\n\n";
      x += 100;
      callbacks += this.volumeCallback + "\n\n";
    }
    if (this.params.attack) {
      init += this.attackInit.replace("<X>", String(x)).replace("<Y>", String(y)) + "\n\n";
      x += 100;
      callbacks += this.attackCallback + "\n\n";
    }
    if (this.params.decay) {
      init += this.decayInit.replace("<X>", String(x)).replace("<Y>", String(y)) + "\n\n";
      x += 100;
      callbacks += this.decayCallback + "\n\n";
    }
    if (this.params.sustain) {
      init += this.sustainInit.replace("<X>", String(x)).replace("<Y>", String(y)) + "\n\n";
      x += 100;
      callbacks += this.sustainCallback + "\n\n";
    }
    if (this.params.release) {
      init += this.releaseInit.replace("<X>", String(x)).replace("<Y>", String(y)) + "\n\n";
      x += 100;
      callbacks += this.releaseCallback + "\n\n";
    }

    init += "\n\n" + this.initTail;

    this.code = init + "\n\n" + callbacks;
    this.code = this.code.replace(/\n\n\n+/g, "\n\n");

    return this.code;
  }
/*
  guiVolume(flag) {
    if (this.params.volume !== flag) {
      this.modifyFlag = true;
      this.params.volume = flag;
    }
  }

  guiAttack(flag) {
    if (this.params.attack !== flag) {
      this.modifyFlag = true;
      this.params.attack = flag;
    }
  }
*/
}

/*
let cb = new CodeBuilder();
console.log("================================");
console.log(cb.getCode());
console.log("--------------------------------");
cb.guiAttack(true);
console.log(cb.getCode());
console.log("================================");
*/


export default KspBuilder;
