# Checks for the single-file prototype

Two scripts, no test framework. They open the prototype in a headless browser
and fail loudly, which is the point: a template-literal mistake in this file
throws at render time and leaves the previous screen on display, so a broken
page looks like a dead click rather than an error.

Run them from this folder with Playwright available:

    node test/flow-test.cjs          # 18 flows: open, read, save, archive, filter, search, add, folders, player, settings
    node test/responsive-check.cjs   # 9 widths from 1680 to 360, every screen, checks nothing runs past the edge

Both adjust the path at the top if you move the prototype. They expect
`quiet-hours.html` one level up.

What they have caught so far:

- A stray fragment injected into the Sources screen by a careless
  find-and-replace, which stopped that screen rendering at all.
- The control row not wrapping at phone width, scrolling the page sideways by
  about 47px on Feed, Later, Archive and Listen.

Run both before publishing a change to the prototype.
