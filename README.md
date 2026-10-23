# MIND//NIGHT — Case 07

A short, responsive psychological-horror web experience about attention, memory, inference, and the importance of preserving uncertainty. Built with plain HTML, CSS, and JavaScript. No backend, account, analytics, external API, package installation, or paid service is required.

## Files

- `index.html` — page structure
- `style.css` — interface, responsive layout, and animations
- `app.js` — story, puzzles, branching endings, optional ambient sound, and sharing
- `favicon.svg` — small browser-tab icon

## Run locally

Open `index.html` in a modern browser. For the most realistic test, use a local server or GitHub Pages; clipboard sharing works best in a secure context (HTTPS).

## Publish on GitHub Pages

1. Sign in to GitHub and create a **new public repository** (for example, `mind-night`).
2. Extract the ZIP, then upload its files directly into the repository root. Keep the filenames unchanged. Upload `index.html`, `style.css`, `app.js`, `favicon.svg`, and optionally `README.md`. Do not upload only the ZIP itself; GitHub Pages needs `index.html` at the top level of the published folder.
3. Open the repository's **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose the `main` branch and the `/ (root)` folder, then click **Save**.
6. Wait for the Pages deployment to complete. Your website URL will appear in the Pages settings; it is normally `https://YOUR-USERNAME.github.io/mind-night/`.

If your repository has a different name, the URL will use that repository name. It may take a short time after saving for the first deployment to appear.

## Customization

- Story text and interactions are in `app.js`.
- Colors and layout variables are at the top of `style.css`.
- Page title and description are in the `<head>` of `index.html`.
- The optional ambient sound is synthesized in the browser with the Web Audio API. It is off by default and does not load audio files.

## Privacy and content note

The game does not send answers to a server or store them beyond the current page session. The share button only shares/copies a short ending summary after the player activates it. The experiences are fictional and are not diagnostic tests, clinical measures, or medical advice. The story intentionally distinguishes observed evidence from unverified explanations and avoids portraying psychiatric conditions as a source of danger.

## License

You may modify and share this project. If you publish your own fork, consider crediting the original project and keep third-party assets properly licensed. The Google Fonts stylesheet is an optional visual enhancement; if unavailable, local system font fallbacks are used.
