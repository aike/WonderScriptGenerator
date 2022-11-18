module.exports = sksp
sksp.displayName = 'sksp'
sksp.aliases = []
function sksp(Prism) {
  Prism.languages.sksp = {
    comment: {
      pattern: /\/\/.*/,
      lookbehind: true,
      greedy: true
    },
    variable: [
      /\b\w+\.[A-Z0-9_]+\b/,
      /#\w+#/
    ],
    builtin: /\b[A-Z][A-Z0-9_]*\b/,
    string: {
      pattern: /"[^"]*"/,
      greedy: true
    },
    number: /-?\d+/,
    function: /set_ui_height_px|set_ui_width_px|make_perfview|set_script_title|find_group|set_control_par_str|set_skin_offset|move_control_px|set_control_par|get_engine_par(_disp)?|set_engine_par|set_knob_defval|set_knob_unit|set_knob_label|message|get_ui_id/,
    keyword: /on init|end on|on ui_control|declare|(end )?const|ui_slider|ui_knob|(end )?macro/,
    punctuation: /\(|\)|,/,
    operator: /:=/
  }
}
