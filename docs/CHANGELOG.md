# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.1.1] - 2026-08-26

### Changed
- Improved website loading speed and reliability by preventing the server from entering sleep mode during periods of inactivity.

### Added
- Automated uptime monitoring that immediately notifies the developer if the platform becomes inaccessible.

---

## [2.1.0] - 2026-08-23

### Changed
- Updated the textual content on the Privacy Policy page and replaced the downloadable PDF with the newest version.
- Translated admin error messages from English to Hungarian for better localised feedback.
- Improved UX in the Admin Portal by making entire client list items clickable.

### Fixed
- Resolved a z-index issue where the side navigation bar overlapped with modal windows.
- Fixed the active state button colour for the *current page* indicator in the admin portal.

### Security
- Integrated the Cloudflare Turnstile widget to ensure a more secure and bot-protected login process.
- Reduced the maximum allowed login attempts from 10 to 5 to better prevent brute-force attacks.

---

## [2.0.0] - 2026-08-22

### Added
- **Admin Portal:** A brand new, secure dashboard to manage daily operations.
- **Client Management:** Complete system to track and manage client details.
- **Reference Management:** Easily upload, edit, and manage reference images with a new drag-and-drop interface.
- **Installable App (PWA):** The admin interface can now be installed as a standalone application on both desktop and mobile devices directly from the profile menu.
- **Animations:** Added smooth scroll animations and dynamic milestones to the public website.

### Changed
- **Website Overhaul:** The entire public website has been rebuilt with modern technologies.
- **Redesigned Hero Section:** A completely fresh and modernized top section for the landing page.
- **Improved Dark Mode:** Refined colors and contrast across the site for better readability and accessibility.
- **Modernized UI:** Replaced older graphics with a consistent icon set.

### Fixed
- Resolved a lingering horizontal scrollbar issue on smaller screens.
- Fixed overlapping layout elements in the mobile navigation view.

### Security
- **Authentication:** Implemented a secure, fully protected login and logout system for the admin panel to prevent unauthorized access.

---

> **Legacy Notes:**
> Versions prior to `2.0.0` *(v1.x.x)* represent the initial, static HTML/CSS build of the website. The full history and source code of this deprecated version are securely preserved in a separate [GitHub repository](https://github.com/Dlevy004/patyod-klima-website).

---

## [1.2.0] - 2025-12-08

This release featuring a complete design overhaul and a modernized technical foundation for better performance and accessibility.

### Fixed
- Major improvements with navigation for keyboard-only users and screen readers (theme switcher, mobile menu's close button).
- Optimized the main hero image and the reference images to improve page load speed.
- The phone numbers in the "Contact" section are now clickable, making it easy to call from a mobile device.
- Corrected the logo link in "Footer" section to properly scroll back to the top of the page.
- Hid all decorative icons from screen readers to reduce noise.
- Fixed the "Scroll to Top" button's size scaling and accessibility labels.

### Changed
- The entire website (all sections, navbar and footer) has been updated with a modern, consistent design.
- The layout now adapts smoothly to any screen size using modern CSS, eliminating layout jumps from small phones to ultra-wide monitors.
- Enhanced styling and visibility for dark mode across all sections.
- Added ***Parallax scrolling*** for desktop backgrounds.

### Security
- Enhanced security for external links (Facebook, Privacy Policy) that open in a new tab (like the Privacy Policy).
- Google Analytics scripts now only load *after* the user explicitly accepts cookies.

---

## [1.1.0] - 2025-09-10

### Added
- Google Analytics integration with cookie tracking
- Updated Privacy Policy to include information about data collected with Google Analytics

### Fixed
- Fixed bugs with the Scroll-up button
- Corrected the background image of the Contact section
- Fixed bugs with the swiper in reference section

### Changed
- Updated styling and layout of the Hero section
- Updated the background of the Reference section
- Removed the top margin from the Reference section
- Replace JPG and PNG images with optimized WebP or AVIF versions

---

## [1.0.0] - 2025-09-06

### Added
- Initital release of the website.
- Basic structure including header, hero, services, references, contact section and footer.
- Basic CSS and JavaScript functionalities implemented.