CREATE TYPE "user_role" AS ENUM (
  'admin',
  'developer'
);

CREATE TYPE "client_type" AS ENUM (
  'individual',
  'company'
);

CREATE TYPE "job_type" AS ENUM (
  'survey',
  'installation',
  'maintenance',
  'cleaning'
);

CREATE TYPE "ad_template_type" AS ENUM (
  'summer_offer',
  'winter_offer',
  'autumn_offer',
  'spring_offer',
  'on_sale_offer'
);

CREATE TYPE "unit_placement_type" AS ENUM (
  'indoor',
  'outdoor'
);

CREATE TYPE "ai_generation_status" AS ENUM (
  'pending',
  'completed',
  'failed'
);

CREATE TABLE "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "full_name" varchar,
  "email" varchar UNIQUE NOT NULL,
  "password_hash" varchar NOT NULL,
  "profile_pic_url" varchar,
  "role" user_role NOT NULL DEFAULT 'admin',
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "clients" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "full_name" varchar NOT NULL,
  "phone" varchar,
  "email" varchar,
  "zip_code" varchar,
  "city" varchar,
  "street_address" varchar,
  "type" client_type NOT NULL DEFAULT 'individual',
  "notes" text,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "company" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" varchar NOT NULL,
  "headquarters" varchar NOT NULL,
  "registration_number" varchar NOT NULL,
  "tax_number" varchar NOT NULL,
  "f_gas_number" varchar NOT NULL,
  "phone_number" varchar NOT NULL,
  "email" varchar NOT NULL,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "jobs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "client_id" uuid,
  "category" job_type,
  "job_date" date NOT NULL,
  "internal_notes" text,
  "general_notes" text,
  "labor_fee" integer DEFAULT 0,
  "total_amount" integer NOT NULL,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "ac_units" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "job_id" uuid,
  "transparent_image_url" varchar,
  "brand" varchar,
  "model_name" varchar,
  "unit_price" integer NOT NULL,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "ad_templates" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "category" ad_template_type NOT NULL,
  "name" varchar NOT NULL,
  "background_image_url" varchar NOT NULL,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "generated_ads" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid,
  "template_id" uuid,
  "headline" varchar,
  "ac_unit_name" varchar NOT NULL,
  "details" text,
  "full_price" integer NOT NULL,
  "show_logo" boolean DEFAULT true,
  "show_phone" boolean DEFAULT true,
  "generated_image_url" varchar NOT NULL,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "reference_image" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "job_id" uuid,
  "image_url" varchar NOT NULL,
  "description" varchar,
  "is_visible" boolean NOT NULL DEFAULT true,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "ai_visual_designs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid,
  "original_image_url" varchar NOT NULL,
  "generated_image_url" varchar,
  "placement_type" unit_placement_type NOT NULL,
  "status" ai_generation_status NOT NULL DEFAULT 'pending',
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "bug_reports" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "reporter_name" varchar,
  "reporter_email" varchar,
  "phone_number" varchar,
  "zip_code" varchar,
  "city" varchar,
  "street_address" varchar,
  "description" text NOT NULL,
  "image_url" varchar,
  "is_handled" boolean DEFAULT false,
  "created_at" timestamp DEFAULT (now())
);

ALTER TABLE "jobs" ADD FOREIGN KEY ("client_id") REFERENCES "clients" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "ac_units" ADD FOREIGN KEY ("job_id") REFERENCES "jobs" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "generated_ads" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "generated_ads" ADD FOREIGN KEY ("template_id") REFERENCES "ad_templates" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "reference_image" ADD FOREIGN KEY ("job_id") REFERENCES "jobs" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "ai_visual_designs" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;
