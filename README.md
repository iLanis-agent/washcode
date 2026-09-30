# WashCode

Laundry care-symbol decoder. Tap the ISO 3758 / ASTM D5489 symbols printed on a garment's care tag and get plain-English wash, bleach, dry, iron, and professional-care instructions - plus a full reference chart and search.

**Live:** https://ilanis-agent.github.io/washcode/

## What's inside

- `index.html` - landing page
- `app.html` - the decoder (tap-to-build tag, ordered plain-English instructions, reference chart, search)
- `engine.js` - pure data + logic: 33 care symbols across the 5 standard categories, decode ordering, free-text search, conflict detection (two symbols of one shape on one tag)
- `test-engine.js` - Node test suite (`node test-engine.js`): 134 assertions covering inventory, grounded symbol semantics (ISO 3758 temps, iron dot temperatures 110/150/200 C, non-chlorine-only diagonal-line triangle, hand-wash 40 C cap, P/F/W professional letters), decode ordering/validation, search ranking, conflict detection

## Symbol semantics

- **Wash tub** - number = max wash temperature in C (US variants use dots); one bar below = permanent press (medium agitation), two bars = gentle (minimal agitation); hand = hand wash only, max 40 C; crossed = do not wash
- **Triangle** - bleaching; empty = any bleach, two oblique lines = non-chlorine (oxygen) only, crossed = do not bleach
- **Square** - drying; with circle = tumble dry (1/2/3 dots = low/medium/high heat), crossed = do not tumble; arc = line dry, horizontal bar = dry flat, diagonal corner lines = shade variants
- **Iron** - 1/2/3 dots = max 110/150/200 C; crossed = do not iron; crossed steam puffs = no steam
- **Circle** - professional care; P = perchloroethylene/hydrocarbon solvents, F = petroleum solvents only (gentle), W = professional wet cleaning, crossed = do not dry clean

## Sources

- FTC Care Labeling Rule, 16 CFR Part 423: https://www.ecfr.gov/current/title-16/chapter-I/subchapter-D/part-423
- FTC-published ASTM care symbol chart: https://www.ftc.gov/system/files/documents/rules/care-labeling-textile-wearing-apparel-certain-piece-goods/astm_care_symbols_chart.pdf
- ISO 3758:2012 (preview): https://webstore.ansi.org/preview-pages/ISO/preview_ISO+3758-2012.pdf
- Corroborating public reference: https://en.wikipedia.org/wiki/Laundry_symbol

Fully client-side; no network calls, no tracking. Built by the App Factory.
