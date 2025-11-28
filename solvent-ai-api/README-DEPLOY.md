Solvent AI API — deployment guide
================================

This document explains how to publish the API server image and deploy it live.

1) Create a GitHub repository for the API
   - From your GitHub account create a new repository named `solvent-ai-api`.
   - Push the contents of `solvent-ai-api/` directory to that repository.

2) Enable GitHub Packages / GHCR (GitHub Container Registry)
   - The provided workflow `/.github/workflows/publish-image.yml` will build and push an image to GHCR on every push to `main`.
   - No extra secrets are required to push to GHCR from GitHub Actions because the workflow uses `GITHUB_TOKEN`.

3) Configure production environment variables
   - In your hosting environment you must set `MONGODB_URI` pointing to your production MongoDB (Atlas recommended).
   - Example: `mongodb+srv://<user>:<password>@cluster0.mongodb.net/solvent-ai?retryWrites=true&w=majority`

4) Run the container on a host
   - Example (on a VPS or Docker host):

     docker pull ghcr.io/<your-github-username>/solvent-ai-api:latest
     docker run -d --name solvent-ai-api -p 3000:3000 \
       -e MONGODB_URI="your_mongodb_uri" \
       ghcr.io/<your-github-username>/solvent-ai-api:latest

5) Use a reverse proxy and HTTPS
   - For production, run the container behind Nginx (or a cloud load balancer) and terminate TLS there.

6) Alternatives
   - Render.com, Fly.io, or DigitalOcean App Platform can deploy a Docker image or Git repo directly and manage scaling.
   - Heroku: push the code (not the image) to Heroku and set `Procfile`/env variables.

If you want, I can:
 - Push this API directory to a new GitHub repository for you (requires your permission/authentication).
 - Configure an automated deployment on a target provider (you need to provide credentials or enable integration).
