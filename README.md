# MIND//NIGHT — The Ward 13 Incident

A dark, mobile-friendly psychological-horror mystery made with plain HTML, CSS, and JavaScript. It is designed to upload directly to GitHub and publish with GitHub Pages.

## What is in the game?

- A fictional psychiatric hospital attacked by vampires.
- 103 registered patients, with 18 surviving files: Cases 1–5 and 44–56.
- Eighteen readable patient dossiers with conflicting timelines, unreliable statements, hidden context, and clues that cross-reference one another.
- An evidence board that unlocks as you inspect records.
- A final accusation where the player selects a case, reconstructs a name, and identifies a motive.
- Multiple endings, including a secret supplemental ending for reading all 18 files and reconstructing the hidden phrase.
- A progressively more disturbing synthesized soundtrack using the browser's Web Audio API. No music files are downloaded; the sound starts only after the player turns it on and can be muted at any time.
- Generated horror imagery bundled locally in `assets/`.
- No accounts, backend, analytics, external AI, or data collection.

## Run locally

1. Download and extract the ZIP.
2. Open `index.html` in a modern browser.
3. If your browser restricts local audio or clipboard operations, publish through GitHub Pages or run a simple local web server. The game itself needs no build step.

## Controls

- **Sound On/Off:** enables or mutes synthesized ambience. The musical texture intensifies as the player logs more case files.
- **Patient Archive:** read the 18 surviving dossiers in either group.
- **Evidence Board:** view recovered and still-corrupted evidence fragments.
- **Final Accusation:** unlocks after reviewing at least 12 files. For the secret supplement, review all 18 and reconstruct the hidden phrase from the clock-related records.
- **Reset:** begins a fresh session and clears the current in-memory investigation progress.

## Story and content note

Everything is fictional. The experience contains supernatural horror and non-graphic references to murder. Some files include sensitive relationship or sexual-history details, but those are deliberately not treated as indicators of violence. The mystery is resolved through corroborated timeline, access, identity, and motive clues—not by diagnosing a character. The game is entertainment and is not a clinical assessment.

## Editing the mystery

The patient-file stories and clue fragments are authored in the `patientFiles` array near the top of `app.js`. Evidence-board rules are in `evidenceCatalog`. The solution check is in `submitAccusation()`. You can add more story content without a compiler or package manager.
