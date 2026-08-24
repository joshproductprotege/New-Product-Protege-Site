# Company logos

The homepage "our coaches have coached, led, and shipped inside these organizations"
strip loads each logo from this folder first, then falls back to a live logo API, then a
favicon, then plain text. To get crisp, self-hosted logos, drop official files here using
these exact filenames (SVG preferred, PNG with transparent background also fine — if you use
PNG, change the extension in the `<img src>` for that row in `index.html`).

| Filename            | Company            | Where to get the official mark            |
|---------------------|--------------------|-------------------------------------------|
| `homedepot.svg`     | The Home Depot     | corporate.homedepot.com media/brand assets |
| `hdsupply.svg`      | HD Supply          | hdsupply.com (footer / press kit)          |
| `statefarm.svg`     | State Farm         | statefarm.com newsroom / brand assets      |
| `usaa.png`          | USAA               | provided by Josh, July 2026 (in place)      |
| `carters.svg`       | Carter's           | carters.com / ir.carters.com               |
| `cox.svg`           | Cox Communications | cox.com / coxmedia brand assets            |
| `ingage.svg`        | Ingage             | ingage.io press / brand                     |
| `emusic.svg`        | eMusic             | emusic.com                                  |
| `glg.svg`           | GLG                | glginsights.com press / brand              |

## Notes

- Wikimedia Commons (commons.wikimedia.org) is a good source for many of these as clean SVGs.
- Prefer full wordmark logos (horizontal) so they read well in the chip layout.
- Aim for logos that look right at ~38px tall; the CSS scales them into white "chip" cards.
- These are third-party trademarks. Confirm usage rights with each company before launch,
  especially since the copy states the coaches worked *inside* these organizations.
- Until real files are added, the site still renders logos via the live fallback API, so
  nothing appears broken in the meantime.
