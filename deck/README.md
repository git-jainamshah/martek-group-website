# Pitch decks

Six ready decks, all built from one slide library. Every slide exists once in
`build-deck.js`; the decks are just different orderings of it.

| File | Slides | Use it for |
|---|---|---|
| `Marrelay-Pitch-Deck.pptx` | 11 | The full studio pitch |
| `Marrelay-startup-Deck.pptx` | 11 | A brand-new business with no site yet |
| `Marrelay-web-Deck.pptx` | 8 | Web development only |
| `Marrelay-data-Deck.pptx` | 8 | Data & analytics only |
| `Marrelay-engineering-Deck.pptx` | 7 | Engineering & CAD only |
| `Marrelay-library-Deck.pptx` | 17 | **Every slide** - copy/paste to assemble your own |

The library deck is the one to open when a pitch does not match a preset: copy
the slides you want into a new file. They all share a layout, so slides moved
between decks stay consistent.

## Building

```bash
node build-deck.js --list                       # show decks and slides
node build-deck.js --deck=startup               # build one
node build-deck.js --deck=web --out="Acme.pptx" # custom filename
```

Page numbers are counted at build time, so reordering or dropping slides never
leaves a stale number behind.

## Making your own deck preset

Add an entry to `DECKS` near the top of `build-deck.js`:

```js
retainer: {
  label: 'Ongoing analytics retainer',
  title: 'Numbers you can\nactually act on.',
  subtitle: 'A weekly rhythm that survives us leaving.',
  slides: ['cover', 'problem', 'serviceData', 'process', 'objections', 'next', 'close'],
},
```

Then `node build-deck.js --deck=retainer`. The build fails loudly if you
reference a slide name that does not exist, rather than silently skipping it.

**Slides available:** `cover`, `about`, `problem`, `problemNew`, `dayOne`,
`launchPath`, `services`, `serviceWeb`, `serviceData`, `serviceEng`, `process`,
`timeline`, `whyUs`, `objections`, `pricing`, `next`, `close`

Two are new-business specific:

- **`dayOne`** - what a new business should buy now vs. what can wait. It sells
  by subtraction; telling someone what *not* to buy is what makes the rest
  credible.
- **`launchPath`** - the five steps from nothing to live.

`problemNew` is the brand-new-business counterpart to `problem`. Use one or the
other, never both.

## Re-skinning for a different business

Edit the `THEME` block at the top and rebuild. Every colour, font and company
name on every slide reads from it, so one edit re-themes all decks consistently.
Three alternate palettes (Midnight, Forest, Monochrome) are commented in - paste
one over `palette`.

### Two things that will bite you

- **Hex codes must not include `#`** - write `E8442E`, not `#E8442E`. A `#`
  produces a file PowerPoint refuses to open.
- **Only use fonts installed on the presenting machine.** The defaults
  (Century Schoolbook, Calibri) ship with Office everywhere. Switching to
  Fraunces or DM Sans to match the website will look right on your Mac and
  silently substitute on a client's laptop.

## Changing the words

`CONTENT` holds the actual pitch - problems, services, process, timeline,
pricing, objections. Edit the text there and the layout reflows.

## Not included

There is no case-study or results slide. The case studies on the site are
written as "how we'd approach it" rather than finished work, and invented client
metrics are the kind of thing that unravels in a room. Once you have a real
project with real numbers, that is the highest-value slide to add.
