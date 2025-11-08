# SOLVENT AI Website

This repository contains the static website for SOLVENT AI Consultancy & Automation.

## Project Structure

- `index.html`: The main landing page.
- `about.html`: Information about SOLVENT AI.
- `services.html`: Details about the services offered.
- `contact.html`: Contact form and information.
- `style.css`: Main stylesheet for the website.
- `script.js`: JavaScript for interactive elements (e.g., typing animation, particle background, mobile menu, form simulation).
- `logo.png`, `logo-footer.webp`: Logo images.

## Deployment Notes

This is a static website and can be deployed to any static site hosting service (e.g., Netlify, Vercel, GitHub Pages, AWS S3).

### Steps for Deployment:

1.  **Version Control**: Ensure all code changes are committed to your version control system (e.g., Git).
2.  **Build Process (Optional)**: For this static site, no complex build process is strictly required. The HTML, CSS, and JavaScript files are ready for deployment as is. If minification or asset optimization is desired, external tools or a simple build script can be integrated.
3.  **Environment Variables**: Not directly applicable for a purely static frontend. Any backend integrations would require server-side environment configuration.
4.  **Security Measures**: 
    -   **HTTPS**: Always deploy with HTTPS enabled. This is typically handled by your hosting provider.
    -   **CORS**: Not usually an issue for static sites unless making requests to external APIs. Ensure any API endpoints you consume have appropriate CORS policies.
5.  **Dependencies**: All client-side dependencies are included directly or via CDN (Google Fonts). No `package.json` or `npm install` is required for the frontend.
6.  **Deployment Scripts/CI/CD**: Set up a continuous integration/continuous deployment (CI/CD) pipeline with your chosen hosting provider for automated deployments on code pushes.
7.  **Database Migrations**: Not applicable as this is a static frontend.
8.  **Staging Environment**: It is highly recommended to deploy to a staging environment that mirrors your production setup for testing before going live.
9.  **Rollback Procedures**: Familiarize yourself with your hosting provider's rollback capabilities in case a deployment introduces issues.

## Local Development

To run the site locally, you can use a simple HTTP server. For example, with Python:

```bash
python -m http.server 8000
```

Then, open your browser and navigate to `http://localhost:8000`.