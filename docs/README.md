<p align="center">
    <img src="./logo.avif" alt="Pátyod Klíma Logó" width="200">
</p>
<h1 align="center">Pátyod Klíma Web Application</h1>


## 📋 About

Developing a dynamic web application to replace the previous static site. The goal is to create a **CMS and business management system** that allows the client to independently:

- Manage advertisements
- Upload and manage reference images
- Track client installations and jobs
- Generate AI-powered visual AC unit placements

My primary goal with this was to reinforce my fundamental knowledge of web development and to master new technologies — covering full-stack development, clean architecture, testing practices, and modern tooling from the ground up.


## 🛠️ Tech Stack

### Designing and Styling
- **Figma** for for UI/UX designing and prototyping
- **dbdiagram.io** for visualize DBML schemas
- **Google Fonts** for typography
- **Unsplash / Pexels** for stock photos

### Frontend
- **React** (Vite)
- Vanilla CSS

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
- **Google Analytics** for tracks and reports website's traffic
- **Render** for deploying the backend and frontend

### Package manager & dependencies
- **npm** package manager

    #### Backend dependencies:
    - **Supabase JS** for managing file storage
    - **Multer** for handling and processing incoming file uploads
    - **Sharp** for image processing, resizing, and WebP optimization
    - **CORS** for enabling secure cross-origin requests between the frontend and the backend
    - **pg** as the PostgreSQL client for the database connection
    - **dotenv** for secure environment variable and configuration management
    - **bcryptjs** for secure password hashing and verification
    - **express-rate-limit** for prevents brute-force login attacks

    #### Frontend dependencies:
    - **React Hot Toast** library for user feedback notifications
    - **Framer Motion** for website animations
    - **Lucide React** for customizable SVG icons
    - **Swiper** for touch-friendly sliders
    - **React Helmet Async** for managing document head metadata dynamically for better SEO
    - **React-Snap** for pre-rendering of the app to improve load times and SEO rankings
    - **ESLint** for maintaining code quality and catching syntax errors
    - **Prop-types** for runtime type checking of component props
    - **Lottie React** for animated components
age (Vitest + RTL) for components and hooks

## 🚧 Planned Features

### Main Features
- 👤 Client management
- 🧰 Job/installation tracking
- 🖼️ Reference image management
- 📢 Ad creation & publishing
- 🤖 AI visual design tool

---

<h3 align="center">👨‍💻 Developer</h3>
<p align="center">Designed and Developed by Daróczi Levente</p>