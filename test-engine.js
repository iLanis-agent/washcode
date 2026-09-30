var W = require('./engine.js');
var passed = 0, failed = 0;
function eq(a, b, msg) { if (a === b) { passed++; } else { failed++; console.log('FAIL: ' + msg + ' (got ' + JSON.stringify(a) + ', want ' + JSON.stringify(b) + ')'); } }
function ok(v, msg) { eq(!!v, true, msg); }

/* inventory */
ok(W.SYMBOLS.length >= 30, 'at least 30 symbols, got ' + W.SYMBOLS.length);
eq(new Set(W.SYMBOLS.map(function (s) { return s.id; })).size, W.SYMBOLS.length, 'all ids unique');
W.SYMBOLS.forEach(function (s) {
  ok(W.CATS.indexOf(s.cat) !== -1, 'valid cat for ' + s.id);
  ok(typeof s.instruction === 'string' && s.instruction.length > 10, 'instruction text for ' + s.id);
  ok(typeof s.icon === 'object' && typeof s.icon.base === 'string', 'icon spec for ' + s.id);
});

/* every category covered */
W.CATS.forEach(function (c) {
  ok(W.SYMBOLS.some(function (s) { return s.cat === c; }), 'category covered: ' + c);
});

/* grounded semantics spot checks (ISO 3758 / ASTM D5489) */
ok(W.getSymbol('wash30').instruction.indexOf('30') !== -1, 'wash30 mentions 30');
ok(W.getSymbol('wash95').instruction.indexOf('95') !== -1, 'wash95 mentions 95');
ok(W.getSymbol('handwash').instruction.indexOf('40') !== -1, 'hand wash capped at 40 C');
ok(W.getSymbol('nowash').instruction.toLowerCase().indexOf('do not wash') !== -1, 'nowash is a prohibition');
ok(W.getSymbol('bleachnc').instruction.toLowerCase().indexOf('non-chlorine') !== -1, 'two diagonal lines = non-chlorine only');
ok(W.getSymbol('nobleach').instruction.toLowerCase().indexOf('do not bleach') !== -1, 'crossed triangle = no bleach');
ok(W.getSymbol('tumblelow').instruction.toLowerCase().indexOf('low') !== -1, '1 dot = low tumble heat');
ok(W.getSymbol('notumble').instruction.toLowerCase().indexOf('do not') !== -1, 'notumble prohibition');
ok(W.getSymbol('ironlow').instruction.indexOf('110') !== -1, 'iron low = 110 C');
ok(W.getSymbol('ironmed').instruction.indexOf('150') !== -1, 'iron medium = 150 C');
ok(W.getSymbol('ironhigh').instruction.indexOf('200') !== -1, 'iron high = 200 C');
ok(W.getSymbol('noiron').instruction.toLowerCase().indexOf('do not iron') !== -1, 'noiron prohibition');
ok(W.getSymbol('drycleanp').instruction.indexOf('P') !== -1, 'P solvent dry clean');
ok(W.getSymbol('wetclean').instruction.toLowerCase().indexOf('wet clean') !== -1, 'W = professional wet cleaning');
ok(W.getSymbol('nodryclean').instruction.toLowerCase().indexOf('do not dry clean') !== -1, 'nodryclean prohibition');

/* decode ordering: output grouped in standard label order regardless of input order */
var d = W.decode(['nodryclean', 'tumblelow', 'wash40', 'noiron', 'nobleach']);
eq(d.length, 5, 'decode returns all 5');
eq(d.map(function (x) { return x.cat; }).join(','), 'wash,bleach,dry,iron,pro', 'decode order follows label order');
eq(d[0].id, 'wash40', 'first entry is wash40');

/* decode validation */
var threw = false; try { W.decode(['nope']); } catch (e) { threw = true; }
ok(threw, 'decode throws on unknown id');
threw = false; try { W.decode('wash40'); } catch (e) { threw = true; }
ok(threw, 'decode throws on non-array');
eq(W.decode([]).length, 0, 'decode of empty list is empty');

/* search */
ok(W.searchSymbols('tumble').length >= 4, 'search tumble finds tumble family');
eq(W.searchSymbols('iron')[0].cat, 'iron', 'search iron returns iron symbols first');
eq(W.searchSymbols('').length, 0, 'empty query returns nothing');
eq(W.searchSymbols('zzzqwerty').length, 0, 'nonsense query returns nothing');
ok(W.searchSymbols('delicate gentle').some(function (s) { return s.bars === 2 || s.icon.bars === 2; }), 'gentle search finds gentle cycles');

/* conflicts */
eq(W.conflicts(['wash30', 'wash60']).length, 1, 'two tub symbols conflict');
eq(W.conflicts(['wash40', 'nobleach', 'tumblelow']).length, 0, 'different categories do not conflict');

console.log('passed: ' + passed + ', failed: ' + failed);
process.exit(failed ? 1 : 0);
