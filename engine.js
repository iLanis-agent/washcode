/* WashCode engine - laundry care symbol decoding.
   Pure data + logic, no DOM. Exported for Node tests and attached to window for the app.
   Symbol semantics follow ISO 3758 (international, numbers = max temp C) and
   ASTM D5489 (US, dots) as published in public charts; the US FTC Care Labeling
   Rule (16 CFR 423) requires care instructions on apparel.
   Each symbol: {id, cat, name, instruction, icon{base, text?, dots?, hand?, cross?,
   bars?, tumble?, letter?, natural?}}. */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) { module.exports = factory(); }
  else { root.WashCode = factory(); }
})(typeof self !== 'undefined' ? self : this, function () {
  var CATS = ['wash', 'bleach', 'dry', 'iron', 'pro'];
  var CAT_LABEL = { wash: 'Washing', bleach: 'Bleaching', dry: 'Drying', iron: 'Ironing', pro: 'Professional care' };

  var SYMBOLS = [
    /* --- washing (tub) --- */
    { id: 'wash30', cat: 'wash', name: 'Machine wash 30', instruction: 'Machine wash cold - max 30 C (85 F), normal cycle.', icon: { base: 'tub', text: '30' } },
    { id: 'wash40', cat: 'wash', name: 'Machine wash 40', instruction: 'Machine wash warm - max 40 C (105 F), normal cycle.', icon: { base: 'tub', text: '40' } },
    { id: 'wash50', cat: 'wash', name: 'Machine wash 50', instruction: 'Machine wash hot - max 50 C (120 F), normal cycle.', icon: { base: 'tub', text: '50' } },
    { id: 'wash60', cat: 'wash', name: 'Machine wash 60', instruction: 'Machine wash hot - max 60 C (140 F), normal cycle.', icon: { base: 'tub', text: '60' } },
    { id: 'wash95', cat: 'wash', name: 'Machine wash 95', instruction: 'Machine wash very hot - max 95 C (200 F), normal cycle (whites, sanitize).', icon: { base: 'tub', text: '95' } },
    { id: 'wash30p', cat: 'wash', name: 'Wash 30 permanent press', instruction: 'Machine wash cold - max 30 C (85 F), permanent-press cycle (medium agitation).', icon: { base: 'tub', text: '30', bars: 1 } },
    { id: 'wash40p', cat: 'wash', name: 'Wash 40 permanent press', instruction: 'Machine wash warm - max 40 C (105 F), permanent-press cycle (medium agitation).', icon: { base: 'tub', text: '40', bars: 1 } },
    { id: 'wash30g', cat: 'wash', name: 'Wash 30 gentle', instruction: 'Machine wash cold - max 30 C (85 F), gentle cycle (minimal agitation, wool/silk).', icon: { base: 'tub', text: '30', bars: 2 } },
    { id: 'wash40g', cat: 'wash', name: 'Wash 40 gentle', instruction: 'Machine wash warm - max 40 C (105 F), gentle cycle (minimal agitation).', icon: { base: 'tub', text: '40', bars: 2 } },
    { id: 'handwash', cat: 'wash', name: 'Hand wash', instruction: 'Hand wash only, max 40 C (105 F) - do not machine wash, do not wring.', icon: { base: 'tub', hand: true } },
    { id: 'nowash', cat: 'wash', name: 'Do not wash', instruction: 'Do not wash in water - see professional care.', icon: { base: 'tub', cross: true } },
    /* --- bleaching (triangle) --- */
    { id: 'bleach', cat: 'bleach', name: 'Bleach allowed', instruction: 'Bleach allowed when needed (chlorine or non-chlorine).', icon: { base: 'triangle' } },
    { id: 'bleachnc', cat: 'bleach', name: 'Non-chlorine bleach', instruction: 'Non-chlorine (oxygen) bleach only - no chlorine bleach.', icon: { base: 'triangle', bars: 2 } },
    { id: 'nobleach', cat: 'bleach', name: 'Do not bleach', instruction: 'Do not bleach.', icon: { base: 'triangle', cross: true } },
    /* --- tumble drying (square + circle) --- */
    { id: 'tumblelow', cat: 'dry', name: 'Tumble dry low', instruction: 'Tumble dry, low heat (one dot).', icon: { base: 'square', tumble: 1 } },
    { id: 'tumblemed', cat: 'dry', name: 'Tumble dry medium', instruction: 'Tumble dry, medium heat (two dots).', icon: { base: 'square', tumble: 2 } },
    { id: 'tumblehigh', cat: 'dry', name: 'Tumble dry high', instruction: 'Tumble dry, high heat (three dots, US).', icon: { base: 'square', tumble: 3 } },
    { id: 'notumble', cat: 'dry', name: 'Do not tumble dry', instruction: 'Do not tumble dry.', icon: { base: 'square', tumble: 0, cross: true } },
    /* --- natural drying (square variants) --- */
    { id: 'linedry', cat: 'dry', name: 'Line dry', instruction: 'Line dry - hang to dry.', icon: { base: 'square', natural: 'line' } },
    { id: 'flatdry', cat: 'dry', name: 'Dry flat', instruction: 'Dry flat - lay out horizontally to dry.', icon: { base: 'square', natural: 'flat' } },
    { id: 'shadedry', cat: 'dry', name: 'Dry in shade', instruction: 'Dry in the shade - keep out of direct sunlight.', icon: { base: 'square', natural: 'shade' } },
    { id: 'lineshade', cat: 'dry', name: 'Line dry in shade', instruction: 'Line dry in the shade.', icon: { base: 'square', natural: 'lineshade' } },
    { id: 'flatshade', cat: 'dry', name: 'Dry flat in shade', instruction: 'Dry flat in the shade.', icon: { base: 'square', natural: 'flatshade' } },
    /* --- ironing --- */
    { id: 'ironlow', cat: 'iron', name: 'Iron low', instruction: 'Iron at low temperature - max 110 C (230 F), no steam for some fabrics.', icon: { base: 'iron', dots: 1 } },
    { id: 'ironmed', cat: 'iron', name: 'Iron medium', instruction: 'Iron at medium temperature - max 150 C (300 F).', icon: { base: 'iron', dots: 2 } },
    { id: 'ironhigh', cat: 'iron', name: 'Iron high', instruction: 'Iron at high temperature - max 200 C (390 F).', icon: { base: 'iron', dots: 3 } },
    { id: 'noiron', cat: 'iron', name: 'Do not iron', instruction: 'Do not iron.', icon: { base: 'iron', cross: true } },
    { id: 'nosteam', cat: 'iron', name: 'No steam', instruction: 'Do not steam - iron dry only.', icon: { base: 'iron', steam: true } },
    /* --- professional care (circle) --- */
    { id: 'dryclean', cat: 'pro', name: 'Dry clean', instruction: 'Dry clean - any solvent (professional care).', icon: { base: 'circle' } },
    { id: 'drycleanp', cat: 'pro', name: 'Dry clean P', instruction: 'Dry clean, professional - perchloroethylene and hydrocarbon solvents (P).', icon: { base: 'circle', letter: 'P' } },
    { id: 'drycleanf', cat: 'pro', name: 'Dry clean F', instruction: 'Dry clean, professional - petroleum (hydrocarbon) solvents only (F), gentle process.', icon: { base: 'circle', letter: 'F' } },
    { id: 'wetclean', cat: 'pro', name: 'Professional wet clean', instruction: 'Professional wet cleaning - do not wash at home.', icon: { base: 'circle', letter: 'W' } },
    { id: 'nodryclean', cat: 'pro', name: 'Do not dry clean', instruction: 'Do not dry clean.', icon: { base: 'circle', cross: true } }
  ];

  var BY_ID = {};
  SYMBOLS.forEach(function (s) { BY_ID[s.id] = s; });

  function getSymbol(id) {
    var s = BY_ID[id];
    if (!s) throw new Error('Unknown symbol id: ' + id);
    return s;
  }

  /* Decode a list of symbol ids into ordered plain-English instructions,
     grouped in the standard label order: wash, bleach, dry, iron, pro. */
  function decode(ids) {
    if (!Array.isArray(ids)) throw new Error('ids must be an array');
    var out = [];
    CATS.forEach(function (cat) {
      ids.forEach(function (id) {
        var s = getSymbol(id);
        if (s.cat === cat) out.push({ cat: cat, label: CAT_LABEL[cat], id: id, name: s.name, instruction: s.instruction });
      });
    });
    return out;
  }

  /* Free-text search over symbol names and instructions. */
  function searchSymbols(query) {
    if (typeof query !== 'string' || !query.trim()) return [];
    var words = query.toLowerCase().trim().split(/[^a-z]+/).filter(function (w) { return w.length > 1; });
    return SYMBOLS.map(function (s) {
      var hay = (s.name + ' ' + s.instruction + ' ' + s.cat + ' ' + s.id).toLowerCase();
      var hayWords = hay.split(/[^a-z]+/);
      var score = 0;
      words.forEach(function (w) {
        if (hayWords.indexOf(w) !== -1) score += 2;
        else if (hay.indexOf(w) !== -1) score += 1;
      });
      return { s: s, score: score };
    }).filter(function (x) { return x.score > 0; })
      .sort(function (a, b) { return b.score - a.score; })
      .map(function (x) { return x.s; });
  }

  /* Sanity: ids on one garment should not contradict (wash 30 AND wash 60). */
  function conflicts(ids) {
    var seen = {}, out = [];
    ids.forEach(function (id) {
      var s = getSymbol(id);
      var key = s.cat + ':' + s.icon.base + (s.icon.tumble != null ? ':tumble' : '');
      if (seen[key]) out.push([seen[key], id]);
      seen[key] = id;
    });
    return out;
  }

  return {
    CATS: CATS,
    CAT_LABEL: CAT_LABEL,
    SYMBOLS: SYMBOLS,
    getSymbol: getSymbol,
    decode: decode,
    searchSymbols: searchSymbols,
    conflicts: conflicts
  };
});
