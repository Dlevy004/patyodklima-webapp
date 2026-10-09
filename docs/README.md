<p align="center">
    <img src="./images/logo.avif" alt="Pátyod Klíma Logó" width="200">
</p>

<h1 align="center">Pátyod Klíma Admin Portal</h1>
<p align="center">
    A dynamic, full-stack CMS and business management system for a HVAC installation company.
</p>

---

## 📋 About

Developing a dynamic web application to replace the previous static site. The goal is to create a **CMS and business management system** that allows the client to independently:

- Manage advertisements
- Upload and manage reference images
- Track client installations and jobs
- Generate AI-powered visual AC unit placements

My primary goal with this was to reinforce my fundamental knowledge of web development and to master new technologies — covering full-stack development, clean architecture, testing practices, and modern tooling from the ground up.

<p align="center">
    <img src="./images/views.png" alt="Pátyod Klíma applikáció különböző felhasználói felületeken" width="450">
</p>

---

## ✨ Features

### Client-Side Website
- Responsive, SEO-optimized public website
- Reference image gallery
- Privacy policy and cookie management

### Admin / CMS
- 📊 Custom dashboard (revenue, client & job statistics, interactive charts)
- 👤 Client management
- 🧰 Job & installation tracking
- 🖼️ Reference gallery CMS
- 🤖 AI-powered visual design tool — generates photorealistic indoor / outdoor AC units on real customer photos
- 📢 Marketing Ad generator & downloader with pre-made templates and brand-specific device catalogs
- 🔐 Secure, password-based admin login

---

## 🛠️ Tech Stack

### Designing and Styling

- **Figma** for for UI/UX designing and prototyping
- **dbdiagram.io** for visualize DBML schemas
- **Google Fonts** for typography
- **Unsplash / Pexels** for stock photos

### Frontend

- **React** (Vite)
- Vanilla **CSS**

### Backend

- **Node.js**
- **Express**
- **Prisma ORM**
- **PostgreSQL** via **Supabase**

### Testing

- **Vitest** and **React Testing Library** for frontend unit testing
- **Jest** for backend unit testing
- **Chrome DevTools** for responsive testing and debugging
- **Postman** for API endpoint testing

### Tools

- **VS Code** is my primary code editor
- **Jira** for agile task management
- **Claude / Gemini** for code optimization and learning
- **Notion** for documentation and note-taking
- **Git & Github** for source control and PR handling
- **CodeRabbit** for PR reviews
- **Google Analytics** for tracks and reports website's traffic
- **Render** for deploying the backend and frontend
- **UptimeRobot** for monitoring the availability, performance, and status of the website
- **Cloudflare AI** for the image inpainting to generate realistic indoor and outdoor HVAC unit placement on photos

---

### 📂 Package Manager & Dependencies

**npm** package manager

<details>
<summary><strong>Backend dependencies</strong></summary>

- **Supabase JS** — file storage management
- **Multer** — handling and processing incoming file uploads
- **Sharp** — image processing, resizing, and WebP optimization
- **CORS** — enabling secure cross-origin requests between frontend and backend
- **pg** — PostgreSQL client for the database connection
- **dotenv** — secure environment variable and configuration management
- **bcryptjs** — secure password hashing and verification
- **express-rate-limit** — prevents brute-force login attacks

</details>

<details>
<summary><strong>Frontend dependencies</strong></summary>

- **React Hot Toast** — user feedback notifications
- **Framer Motion** — website animations
- **Lucide React** — customizable SVG icons
- **Swiper** — touch-friendly sliders
- **React Helmet Async** — managing document head metadata dynamically for better SEO
- **React-Snap** — pre-rendering of the app to improve load times and SEO rankings
- **ESLint** — maintaining code quality and catching syntax errors
- **Recharts** — custom statistics and charts for the dashboard
- **Lottie React** — animated components
- **React-Select** — custom dropdowns
- **Vite-Imagetools** — compile-time image optimization

</details>

---

## ⚙️ Backend environment variables

| Variable name | Description | Required | Secret | Environment |
| :--- | :--- | :---: | :---: | :---: |
| `PORT` | The port on which the backend server will listen for incoming requests (default: `3000`) | **No** | No | dev, prod |
| `FRONTEND_URL` | Allowed CORS origin for the frontend application | **Yes** | No | prod |
| `DATABASE_URL` | PostgreSQL database connection | **Yes** | **Yes** | dev, prod |
| `DIRECT_URL` | Direct database connection (for Prisma migrations) | **Yes** | **Yes** | dev, prod |
| `SUPABASE_URL` | Supabase project endpoint for image uploads | **Yes** | No | dev, prod |
| `SUPABASE_KEY` | Supabase API key | **Yes** | **Yes** | dev, prod |
| `JWT_SECRET` | Secret key for signing and verifying JWT tokens | **Yes** | **Yes** | dev, prod |
| `JWT_EXPIRES_IN` | Basic login token expiration time (e.g., `15m`) | **Yes** | No | dev, prod |
| `JWT_REMEMBER_EXPIRES_IN` | "Remember Me" login token expiration time (e.g., `3d`) | **Yes** | No | dev, prod |
| `ADMIN_EMAIL` | The primary administrator account email address | **Yes** | **Yes** | dev, prod |
| `ADMIN_PASSWORD` | The primary administrator account password (changed after first login) | **Yes** | **Yes** | dev, prod |
| `DEV_EMAIL` | The developer test account email address | No | **Yes** | dev, prod |
| `DEV_PASSWORD` | The developer test account password | No | **Yes** | dev, prod |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile CAPTCHA server-side secret key | **Yes** | **Yes** | dev, prod |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account identifier | **Yes** | **Yes** | dev, prod |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token for Visual Design integration | **Yes** | **Yes** | dev, prod |

---

<h3 align="center">👨‍💻 Developer</h3>
<p align="center">Designed and Developed by Daróczi Levente</p>