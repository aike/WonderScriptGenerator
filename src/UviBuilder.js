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
      'setSize(720, <HEIGHT>)\n'
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
      'local volume\n'
    + 'volume = Knob("Volume", 1, 0, 2)\n'
    + 'volume.pos = {<X>, <Y>}\n'
    + 'volume.size = {<W>, <H>}\n'
    + 'volume:setStripImage("<KNOB_IMAGE>", <STEP>)\n'
    + 'volume.mapper = Mapper.Cubic\n'
    + 'volume.unit = Unit.LinearGain\n'
    + 'volume:setValue(Program:getParameter("Volume"))\n'
    + 'volume.changed = function(self)\n'
    + '  Program:setParameter("Volume", self.value)\n'
    + 'end\n'
    + '\n'
    ;

    // ---------------------
    this.egInitHead =
    '-- Note: To use Envelope Generator, set EG(Analog ADSR, etc.) into modulation of Keygroup.\n'
    + 'local eg\n'
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
      + '\n'
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
      '  attack = Knob("Attack", 0, 0, 4)\n'
    + '  attack.pos = {<X>, <Y>}\n'
    + '  attack.size = {<W>, <H>}\n'
    + '  attack:setStripImage("<KNOB_IMAGE>", <STEP>)\n'
    + '  attack.mapper = Mapper.Quartic\n'
    + '  attack.unit = Unit.Seconds\n'
    + '  attack:setValue(eg:getParameter("AttackTime"))\n'
    + '  attack.changed = function(self)\n'
    + '    eg:setParameter("AttackTime", self.value)\n'
    + '  end\n'
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
    '  decay = Knob("Decay", 0, 0, 4)\n'
    + '  decay.pos = {<X>, <Y>}\n'
    + '  decay.size = {<W>, <H>}\n'
    + '  decay:setStripImage("<KNOB_IMAGE>", <STEP>)\n'
    + '  decay.mapper = Mapper.Quartic\n'
    + '  decay.unit = Unit.Seconds\n'
    + '  decay:setValue(eg:getParameter("DecayTime"))\n'
    + '  decay.changed = function(self)\n'
    + '    eg:setParameter("DecayTime", self.value)\n'
    + '  end\n'
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
      '  sustain = Knob("Sustain", 1, 0, 1)\n'
    + '  sustain.pos = {<X>, <Y>}\n'
    + '  sustain.size = {<W>, <H>}\n'
    + '  sustain:setStripImage("<KNOB_IMAGE>", <STEP>)\n'
    + '  sustain.mapper = Mapper.Linear\n'
    + '  sustain.unit = Unit.PercentNormalized\n'
    + '  sustain:setValue(eg:getParameter("SustainLevel"))\n'
    + '  sustain.changed = function(self)\n'
    + '    eg:setParameter("SustainLevel", self.value)\n'
    + '  end\n'
    ;

    this.releaseInit =
      '  release = Knob("Release", 0.1, 0, 4)\n'
    + '  release.pos = {<X>, <Y>}\n'
    + '  release.mapper = Mapper.Quartic\n'
    + '  release.unit = Unit.Seconds\n'
    + '  release:setValue(eg:getParameter("ReleaseTime"))\n'
    + '  release.changed = function(self)\n'
    + '    eg:setParameter("ReleaseTime", self.value)\n'
    + '  end\n'
    ;

    this.releaseInitWithCustomKnob =
      '  release = Knob("Release", 0.1, 0, 4)\n'
    + '  release.pos = {<X>, <Y>}\n'
    + '  release.size = {<W>, <H>}\n'
    + '  release:setStripImage("<KNOB_IMAGE>", <STEP>)\n'
    + '  release.mapper = Mapper.Quartic\n'
    + '  release.unit = Unit.Seconds\n'
    + '  release:setValue(eg:getParameter("ReleaseTime"))\n'
    + '  release.changed = function(self)\n'
    + '    eg:setParameter("ReleaseTime", self.value)\n'
    + '  end\n'
    ;


    // ---------------------

    this.lpfInit = 
      '-- Note: To use Lpf, set Lpf(Lowpass 12, LowPass24, etc.) into FX lane of Program.\n'
      + 'local lpf\n'
      + 'local cutoff, resonance\n'
      + 'for _, module in pairs(Program.inserts) do\n'
      + '  if module:hasParameter("Freq") then\n'
      + '    lpf = module\n'
      + '  end\n'
      + 'end\n'
      + 'if lpf then\n'
      + '  cutoff = Knob("CutOff", 1000, 20, 20000)\n'
      + '  cutoff.pos = {<X>, <Y>}\n'
      + '  cutoff.mapper = Mapper.Exponential\n'
      + '  cutoff.unit = Unit.Hertz\n'
      + '  cutoff:setValue(lpf:getParameter("Freq"))\n'
      + '  cutoff.changed = function(self)\n'
      + '    lpf:setParameter("Freq", self.value)\n'
      + '  end\n'
      + '\n'
      + '  resonance = Knob("Resonance", 0, 0, 1)\n'
      + '  resonance.pos = {<X>, <Y>}\n'
      + '  resonance.mapper = Mapper.Linear\n'
      + '  resonance.unit = Unit.PercentNormalized\n'
      + '  resonance:setValue(lpf:getParameter("Q"))\n'
      + '  resonance.changed = function(self)\n'
      + '    lpf:setParameter("Q", self.value)\n'
      + '  end\n'
      + 'end\n'
      ;

    this.lpfInitWithCustomKnob =
    '-- Note: To use Lpf, set Lpf(Lowpass 12, LowPass24, etc.) into FX lane of Program.\n'
    + 'local lpf\n'
    + 'local cutoff, resonance\n'
    + 'for _, module in pairs(Program.inserts) do\n'
    + '  if module:hasParameter("Freq") then\n'
    + '    lpf = module\n'
    + '  end\n'
    + 'end\n'
    + 'if lpf then\n'
    + '  cutoff = Knob("CutOff", 1000, 20, 20000)\n'
    + '  cutoff.pos = {<X>, <Y>}\n'
    + '  cutoff.size = {<W>, <H>}\n'
    + '  cutoff:setStripImage("<KNOB_IMAGE>", <STEP>)\n'
    + '  cutoff.mapper = Mapper.Exponential\n'
    + '  cutoff.unit = Unit.Hertz\n'
    + '  cutoff:setValue(lpf:getParameter("Freq"))\n'
    + '  cutoff.changed = function(self)\n'
    + '    lpf:setParameter("Freq", self.value)\n'
    + '  end\n'
    + '\n'
    + '  resonance = Knob("Resonance", 0, 0, 1)\n'
    + '  resonance.pos = {<X>, <Y>}\n'
    + '  resonance.size = {<W>, <H>}\n'
    + '  resonance:setStripImage("<KNOB_IMAGE>", <STEP>)\n'
    + '  resonance.mapper = Mapper.Linear\n'
    + '  resonance.unit = Unit.PercentNormalized\n'
    + '  resonance:setValue(lpf:getParameter("Q"))\n'
    + '  resonance.changed = function(self)\n'
    + '    lpf:setParameter("Q", self.value)\n'
    + '  end\n'
    + 'end\n'
    ;

    // ---------------------

    this.reverbInit =
      '  -- Note: To use Reverb, set SparkVerb into FX lane of Program.\n'
      + 'local rev\n'
      + 'local reverb, size\n'
      + 'for _, module in pairs(Program.inserts) do\n'
      + '  if module:hasParameter("RoomSize") then\n'
      + '    rev = module\n'
      + '  end\n'
      + 'end\n'
      + 'if rev then\n'
      + '  reverb = Knob("Reverb", 0.5, 0, 1)\n'
      + '  reverb.pos = {<X>, <Y>}\n'
      + '  reverb.mapper = Mapper.Linear\n'
      + '  reverb.unit = Unit.PercentNormalized\n'
      + '  reverb:setValue(rev:getParameter("Mix"))\n'
      + '  reverb.changed = function(self)\n'
      + '    rev:setParameter("Mix", self.value)\n'
      + '  end\n'
      + '\n'
      + '  size = Knob("Size", 20, 4, 50)\n'
      + '  size.pos = {<X>, <Y>}\n'
      + '  size.mapper = Mapper.Quadratic\n'
      + '  size.displayText = string.format("%.2f", size.value) .. " m"\n'
      + '  size:setValue(rev:getParameter("RoomSize"))\n'
      + '  size.changed = function(self)\n'
      + '    rev:setParameter("RoomSize", self.value)\n'
      + '    size.displayText = string.format("%.2f", size.value) .. " m"\n'
      + '  end\n'
      + 'end\n'
      ;


    this.reverbInitWithCustomKnob =
      '-- Note: To use Reverb, set SparkVerb into FX lane of Program.\n'
    + 'local rev\n'
    + 'local reverb, size\n'
    + 'for _, module in pairs(Program.inserts) do\n'
    + '  if module:hasParameter("RoomSize") then\n'
    + '    rev = module\n'
    + '  end\n'
    + 'end\n'
    + 'if rev then\n'
    + '  reverb = Knob("Reverb", 0.5, 0, 1)\n'
    + '  reverb.pos = {<X>, <Y>}\n'
    + '  reverb.size = {<W>, <H>}\n'
    + '  reverb:setStripImage("<KNOB_IMAGE>", <STEP>)\n'
    + '  reverb.mapper = Mapper.Linear\n'
    + '  reverb.unit = Unit.PercentNormalized\n'
    + '  reverb:setValue(rev:getParameter("Mix"))\n'
    + '  reverb.changed = function(self)\n'
    + '    rev:setParameter("Mix", self.value)\n'
    + '  end\n'
    + '\n'
    + '  size = Knob("Size", 20, 4, 50)\n'
    + '  size.pos = {<X>, <Y>}\n'
    + '  size.size = {<W>, <H>}\n'
    + '  size:setStripImage("<KNOB_IMAGE>", <STEP>)\n'
    + '  size.mapper = Mapper.Quadratic\n'
    + '  size.displayText = string.format("%.2f", size.value) .. " m"\n'
    + '  size:setValue(rev:getParameter("RoomSize"))\n'
    + '  size.changed = function(self)\n'
    + '    rev:setParameter("RoomSize", self.value)\n'
    + '    size.displayText = string.format("%.2f", size.value) .. " m"\n'
    + '  end\n'
    + 'end\n'
    ;

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
      .replace('<PANEL_IMAGE>', this.params.panel_image)
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
        init += this.lpfInit.replace('<X>', this.params.lpf_x).replace(/<Y>/g, this.params.lpf_y)
        .replace('<X>', x100) + '\n\n';
      }
      if (this.params.reverb) {
        let x100 = Number(this.params.reverb_x) + 100;
        init += this.reverbInit.replace('<X>', this.params.reverb_x).replace(/<Y>/g, this.params.reverb_y)
        .replace('<X>', x100) + '\n\n';
      }

    } else {
      // custom knob
      if (this.params.volume) {
        init += this.volumeInitWithCustomKnob
        .replace('<X>', this.params.volume_x).replace('<Y>', this.params.volume_y) + '\n\n';
      }
      if ( this.params.attack
        || this.params.decay
        || this.params.sustain
        || this.params.release
      ) {
        init += this.egInitHead;
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
      if ( this.params.attack
        || this.params.decay
        || this.params.sustain
        || this.params.release
      ) {
        init += this.egInitTail;
      }
      if (this.params.lpf) {
        let x100 = Number(this.params.lpf_x) + 100;
        init += this.lpfInitWithCustomKnob
        .replace('<X>', this.params.lpf_x).replace(/<Y>/g, this.params.lpf_y)
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
    .replace(/<W>/g, this.params.custom_knob_w)
    .replace(/<H>/g, this.params.custom_knob_h)
    .replace(/<STEP>/g, this.params.custom_knob_step)
    .replace(/<KNOB_IMAGE>/g, this.params.knob_image);

    this.code = init + '\n\n';
    this.code = this.code.replace(/\n\n\n+/g, '\n\n');

    return this.code;
  }
}


export default UviBuilder;
