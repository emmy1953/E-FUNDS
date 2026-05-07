# E-FUNDS Demo Banking App

This is a simple static demo app built with HTML, CSS, and JavaScript.

## Deploying on Vercel

1. Create a GitHub repository and push this project.
   - Include `index.html`, `script.js`, `styles.css`.

2. Sign in to Vercel at https://vercel.com.

3. Click **New Project** and import the GitHub repository.

4. Configure the project:
   - Framework Preset: **Other**
   - Build Command: leave blank
   - Output Directory: leave blank or `/`

5. Click **Deploy**.

6. After deployment, Vercel will give you a live URL.

## Local testing

To preview locally before deploying, run a simple HTTP server from the project folder:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Notes

- The app stores state in browser `localStorage`.
- No backend or build step is required.
