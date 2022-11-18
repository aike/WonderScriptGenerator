'use strict'

module.exports = ksp
ksp.displayName = 'ksp'
ksp.aliases = []
function ksp(Prism) {
  Prism.languages.ksp = {
    comment: {
      pattern: /{.*}/,
      greedy: false
   },
   builtin: {
     pattern: /\$[A-Z0-9_]+\b/,
     greedy: true
   },
   string: /"[^"]*"/,
   number: /-?\d+/,
   function: /set_ui_height_px|set_ui_width_px|make_perfview|set_script_title|find_group|set_control_par_str|set_skin_offset|move_control_px|set_control_par|get_engine_par(_disp)?|set_engine_par|set_knob_defval|set_knob_unit|set_knob_label|message|get_ui_id/,
   keyword: /on init|end on|on ui_control|declare|const|ui_slider|ui_knob/,
   punctuation: /\(|\)|,/,
   operator: /:=/
  }
}
