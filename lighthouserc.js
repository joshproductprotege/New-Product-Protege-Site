// Lighthouse CI configuration for the Product Protege marketing site.
//
// This is the source of truth for the accessibility gate. It is consumed by
// .github/workflows/lighthouse.yml, which runs on every pull request into
// main (before Netlify auto-deploys main).
//
// Gate summary:
//   accessibility  -> error, minScore 0.90  (this FAILS the check / blocks merge)
//   performance    -> warn                  (informational, never blocks)
//   best-practices -> warn                  (informational, never blocks)
//   seo            -> warn                   (informational, never blocks)
//
// Why performance is only a warning: scores fluctuate with network conditions,
// and the ~19MB North overview video legitimately depresses performance. We do
// not want that blocking valid merges. See CLAUDE.md "Accessibility gate".

module.exports = {
  ci: {
    collect: {
      // No build step: serve the repo root as-is. LHCI starts its own static
      // server, discovers index.html, and audits it.
      staticDistDir: '.',
      // Run 3 passes and use the median run for scoring, to reduce run-to-run
      // noise. LHCI selects the median run as the "representative" one.
      numberOfRuns: 3,
      settings: {
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],

        // ---- Desktop preset (primary audience is business / desktop) ----
        // The three blocks below (formFactor + screenEmulation + throttling)
        // plus the user agent reproduce Lighthouse's built-in `desktop` preset.
        //
        // To run MOBILE instead: set formFactor to 'mobile', screenEmulation to
        //   { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75,
        //     disabled: false }, and throttling to the mobile 4G defaults
        //   { rttMs: 150, throughputKbps: 1638.4, cpuSlowdownMultiplier: 4,
        //     requestLatencyMs: 562.5, downloadThroughputKbps: 1474.56,
        //     uploadThroughputKbps: 675 }.
        // To run BOTH desktop and mobile: duplicate the lighthouse job in the
        //   workflow as a matrix over form factor, or add a second lhci config.
        formFactor: 'desktop',
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false,
        },
        throttling: {
          rttMs: 40,
          throughputKbps: 10 * 1024,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        },
        emulatedUserAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Chrome-Lighthouse',
      },
    },

    assert: {
      assertions: {
        // THE GATE. Accessibility must be at least 0.90 or the check fails.
        // To adjust the threshold, change the minScore below.
        'categories:accessibility': ['error', { minScore: 0.9 }],

        // Informational only. `warn` never fails the build regardless of score.
        // Performance is expected to be low because of the North overview video.
        'categories:performance': ['warn', { minScore: 0.5 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
      },
    },

    upload: {
      // Default target. The workflow overrides this per step: `filesystem` to
      // write the HTML report for the artifact, and `temporary-public-storage`
      // to publish a shareable report link and post status checks.
      target: 'temporary-public-storage',
    },
  },
};
