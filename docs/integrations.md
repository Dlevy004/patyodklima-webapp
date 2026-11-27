# Third-Party Integrations

This document outlines the external third-party services integrated into the application, their configuration requirements, and current operational status.

## 1. Cloudflare Turnstile (Bot Protection)

- **Purpose:** Protects the admin authentication endpoint (`POST /api/auth/login`) from automated bot logins and brute-force attempts, working alongside `express-rate-limit`.
- **How It Works:**
  1. The frontend renders the Turnstile widget on the login screen and sends the generated `turnstileToken` in the login request body.
  2. Before checking user credentials, `authController.login` verifies the token server-side via a `POST` request to `https://challenges.cloudflare.com/turnstile/v0/siteverify`.
  3. If verification fails or the token is missing, the API rejects the login attempt with `400 Bad Request`.
- **Configuration:**
  - Frontend: `VITE_TURNSTILE_SITE_KEY`
  - Backend: `TURNSTILE_SECRET_KEY`

---

## 2. Cloudflare Workers AI (Visual Design Generator)

- **Purpose:** Powers the AI Visual Design feature (`POST /api/visual-designs/generate`), which places indoor split air conditioners or outdoor compressor units onto customer photos based on a user-drawn mask (`image` + `mask` multipart upload) and placement type (`indoor` or `outdoor`).
- **Deprecation Notice (Action Required):**
  - Cloudflare Workers AI has **decommissioned/deprecated** the legacy `@cf/runwayml/stable-diffusion-v1-5-inpainting` model previously used by this service.
  - As a result, AI image generation is temporarily unavailable, and a deprecation warning banner is currently displayed in the admin interface (`VisualDesign.jsx`).
  - **Planned Migration:** The backend integration in `visualDesignService` needs to be migrated to Cloudflare's recommended **Flux** image generation/inpainting model, adapting the input parameters and output stream handling accordingly.
- **Configuration:**
  - Backend: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`

---

## 3. Google Analytics 4 (GA4)

- **Purpose:** Tracks visitor traffic, page views, and user interactions across the public-facing website.
- **How It Works:**
  - Loaded on the React frontend using the hardcoded GA4 Measurement ID (`G-8ME9DQ3SZK`) in `frontend/index.html` and `frontend/src/components/common/CookiePanel.jsx`.
  - Analytics initialization respects the user's cookie consent choices configured in `CookiePanel`.
- **Configuration:**
  - No environment variable is currently read for GA4; changing the analytics property requires updating the hardcoded Measurement ID (`G-8ME9DQ3SZK`) in both frontend files.