---
slug: src-routes-page-svelte
target: src/routes/+page.svelte
score: 25
p0: 0
p1: 2
p2: 2
p3: 1
timestamp: 2026-06-23T09-12-47Z
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Active filters clear; no total-count indicator; progress bar hidden until sign-in |
| 2 | Match System / Real World | 3 | Phase/saga names match MCU canon; IMDb and RT ratings instantly recognizable |
| 3 | User Control and Freedom | 2 | No search, no jump-to-phase; scrolling 800px to reach Phase 4 is a trap |
| 4 | Consistency and Standards | 3 | Filter chips consistent; two accent colors create mild tension |
| 5 | Error Prevention | 3 | Filters reversible; watched state toggleable; no destructive actions |
| 6 | Recognition Rather Than Recall | 3 | All options visible; icon-labeled filter chips; era tags provide context |
| 7 | Flexibility and Efficiency | 2 | No keyboard shortcuts; no search; no phase-jump; 60+ items = pure scroll |
| 8 | Aesthetic and Minimalist Design | 3 | Clean overall; saga eyebrow adds noise; lone dot above phase heading vestigial |
| 9 | Error Recovery | 2 | Empty-state exists for exhausted filters; no Firebase/API error states |
| 10 | Help and Documentation | 1 | No onboarding; zero explanation of chronological vs release |
| **Total** | | **25/40** | **Acceptable** |

## Priority Issues

- P1: No navigation beyond scroll — 60+ entries, no search, no phase-jump
- P1: Cold first-load — zero orienting context after title/tagline removal
- P2: SagaHeader uses banned uppercase-tracked eyebrow visual treatment
- P2: Phase header full card — lone dot above heading is vestigial after saga name removal
- P3: Card info row gets crowded on series entries with long titles
