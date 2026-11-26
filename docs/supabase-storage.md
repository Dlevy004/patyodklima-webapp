# Supabase Storage Architecture

This document describes the Supabase Storage buckets, file validation rules, and security mechanisms used by the backend to manage image assets.

## Storage Buckets

All file uploads and deletions are handled server-side through `supabaseService` using the Supabase service role key. Public URLs returned by Supabase Storage are stored in the corresponding PostgreSQL tables.

| Bucket Name | Related DB Table & Column | Max File Size | Allowed Formats | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **`Avatars`** | `users.profile_pic_url` | 5 MB | Image files | Stores admin user profile pictures uploaded via `PUT /api/auth/profile`. |
| **`Marketing`** | `generated_marketings.generated_image_url`<br>`ad_templates.background_image_url`<br>`ac_units.transparent_image_url` | 10 MB | `image/*` | Stores generated promotional creatives (`POST /api/marketings/generate`) as well as template backgrounds and transparent AC unit assets. |
| **`VisualDesign`** | `ai_visual_designs.original_image_url`<br>`ai_visual_designs.generated_image_url` | 10 MB / file | Image files | Stores uploaded customer room/exterior photos (`image`) and AI-generated AC placement previews. |
| **Default Bucket** *(References)* | `reference_image.image_url` | 10 MB | JPEG, PNG, WebP, AVIF | Stores installation reference photos displayed in the public portfolio gallery (`POST /api/references`). |

## Access Policies & Lifecycle Management

- **Public Read Access:** All buckets require public read (`SELECT`) permissions so that stored `supabase.co` URLs can be rendered directly on the public website and in the admin dashboard without signed URL expiration issues.
- **Restricted Write Access:** Direct client-side uploads to Supabase Storage are disabled. Every upload passes through Express `multer` memory storage middleware first for size and MIME-type validation.
- **Automatic Cleanup & Rollback:**
  - When a record is deleted (e.g., `DELETE /api/references/:id`, `DELETE /api/marketings/:id`, `DELETE /api/visual-designs/:id`), the backend removes the associated image file(s) from Supabase Storage.
  - When an admin updates their avatar, the previous avatar file is automatically deleted once the database update succeeds.
  - If a database insert or update fails after a file has already been uploaded, the controller triggers a rollback deletion to prevent orphaned files in storage.

## Image Processing & Download Security

- **Binary Validation (`sharp`):** Reference uploads undergo binary header inspection via `sharp` to verify valid dimensions and supported formats (`jpeg`, `png`, `webp`, and `avif`/`heif` with `av1` compression).
- **Secure Download Proxy:** The `/download` endpoints (`/api/references/:id/download`, `/api/marketings/:id/download`, `/api/visual-designs/:id/download`) fetch images server-side, convert them to standardized `.png` files using `sharp`, and serve them as downloadable attachments.
- **SSRF Protection:** Before fetching any remote image URL during download, the backend verifies that the hostname belongs to `supabase.co`, disables HTTP redirects (`redirect: 'error'`), and enforces a 15-second request timeout.