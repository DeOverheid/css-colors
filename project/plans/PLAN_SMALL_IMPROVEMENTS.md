# Small Improvements Plan

## Group A — Defaults & Navigation

- [x]   1. Set default hue to 180
- [x]   2. Set default saturation to 75
- [x]   3. Add "Next step" button in bottom panel (centered, all steps except last, advances step)

## Group B — UI Tone Saturation

- [x]   4. UI tones too saturated — should follow hue from secondary/tertiary but use grey saturation
- [x]   5. For custom theme, use primary saturation / 10 for UI tone saturation
- [x]   6. Updating complementary colors should update UI tone with muted saturation

## Group C — Step 2 Top Panel

- [x]   7. Same padding as step 1, narrower swatches fitting 100%, radio group for UI tones with button appearance (no gaps, no radio dots, rounding only first/last)

## Group D — Bezier & Dark Mode

- [x]   8. Bezier input grid lines and handle lines too bright — make 2 steps darker
- [x]   9. Dark mode background: chosen UI-tone swatch 800 with 500 grid lines

## Group E — Side Panel Layout

- [x]   10. Grey shift sliders move to bottom of side panels (flex), remove HR/line between them
- [x]   15. Step 4: move side panel titles to bottom of panel

## Group F — Grey Swatch Rules

- [x]   11. Lightness adjustment offset should NOT apply to grey swatches
- [x]   12. Always put neutral grey swatch on top of other greys
- [x]   13. Only show 3 grey swatches below neutral on step 2; on step 3+, only show neutral/primary grey (or secondary/tertiary when selected)

## Group G — Naming

- [ ]   14. In custom theme, call swatches "Primary", "Secondary", "Tertiary" and keep those names throughout, including UI tones.

## Group H — Slider UX

- [ ]   16. Remove slider values of horizontal sliders, add as tooltip on hover/mousedown
- [ ]   17. Flip dark strength slider track: primary → black
- [ ]   18. Flip light side "Light falloff" track
- [ ]   19. Dark "Light falloff" track: primary → white
- [ ]   20. Dark hue falloff slider background: orange → green
- [ ]   21. Light hue falloff slider background: cyan → violet
- [ ]   22. Dynamic hue falloff track: right side = dark/light hue midpoint (120/250), left side = first hue offset slider handle value

## Group I — Step 5 Polish

- [ ]   23. Hide copy hue offsets button, only show when dev-mode active
- [ ]   24. Remove the duplicate sentence in text
- [ ]   25. Show second grey swatch too
