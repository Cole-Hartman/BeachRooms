-- Migration: Update schema to match DATA_MODEL.md
-- Adds new columns to existing tables, creates blackout_dates table,
-- adds check constraints, and creates performance indexes.

-- =============================================================================
-- 1. buildings: add image_url, weekday_open, weekday_close
-- =============================================================================

ALTER TABLE "public"."buildings"
  ADD COLUMN IF NOT EXISTS "image_url" "text",
  ADD COLUMN IF NOT EXISTS "weekday_open" time without time zone,
  ADD COLUMN IF NOT EXISTS "weekday_close" time without time zone;

ALTER TABLE "public"."buildings"
  ADD CONSTRAINT "buildings_weekday_hours_check"
  CHECK ("weekday_open" IS NULL OR "weekday_close" > "weekday_open");

-- =============================================================================
-- 2. classrooms: add image_url, capacity check
-- =============================================================================

ALTER TABLE "public"."classrooms"
  ADD COLUMN IF NOT EXISTS "image_url" "text";

ALTER TABLE "public"."classrooms"
  ADD CONSTRAINT "classrooms_capacity_check"
  CHECK ("capacity" > 0);

-- Make amenities NOT NULL (already has a default of '{}')
ALTER TABLE "public"."classrooms"
  ALTER COLUMN "amenities" SET NOT NULL;

-- =============================================================================
-- 3. class_schedules: add course_title, instructor_name, end_time check
-- =============================================================================

ALTER TABLE "public"."class_schedules"
  ADD COLUMN IF NOT EXISTS "course_title" "text",
  ADD COLUMN IF NOT EXISTS "instructor_name" "text";

ALTER TABLE "public"."class_schedules"
  ADD CONSTRAINT "class_schedules_time_check"
  CHECK ("end_time" > "start_time");

-- =============================================================================
-- 4. profiles: add avatar_url
-- =============================================================================

ALTER TABLE "public"."profiles"
  ADD COLUMN IF NOT EXISTS "avatar_url" "text";

-- =============================================================================
-- 5. reports: add status, expires_at
-- =============================================================================

ALTER TABLE "public"."reports"
  ADD COLUMN IF NOT EXISTS "status" "text" NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS "expires_at" timestamp with time zone;

-- =============================================================================
-- 6. New table: blackout_dates
-- =============================================================================

CREATE TABLE IF NOT EXISTS "public"."blackout_dates" (
  "id" "uuid" DEFAULT gen_random_uuid() NOT NULL,
  "date" date NOT NULL,
  "description" "text",
  "building_id" "uuid",
  "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."blackout_dates" OWNER TO "postgres";

ALTER TABLE ONLY "public"."blackout_dates"
  ADD CONSTRAINT "blackout_dates_pkey" PRIMARY KEY ("id");

-- Unique constraint for building-specific blackouts
ALTER TABLE ONLY "public"."blackout_dates"
  ADD CONSTRAINT "blackout_dates_date_building_id_key" UNIQUE ("date", "building_id");

-- Partial unique index for campus-wide blackouts (building_id IS NULL)
CREATE UNIQUE INDEX "blackout_dates_date_campus_wide_idx"
  ON "public"."blackout_dates" ("date")
  WHERE "building_id" IS NULL;

ALTER TABLE ONLY "public"."blackout_dates"
  ADD CONSTRAINT "blackout_dates_building_id_fkey"
  FOREIGN KEY ("building_id") REFERENCES "public"."buildings"("id") ON DELETE CASCADE;

-- RLS
ALTER TABLE "public"."blackout_dates" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "blackout_dates_select_all"
  ON "public"."blackout_dates" FOR SELECT USING (true);

-- Grants (match existing table grant pattern)
GRANT ALL ON TABLE "public"."blackout_dates" TO "anon";
GRANT ALL ON TABLE "public"."blackout_dates" TO "authenticated";
GRANT ALL ON TABLE "public"."blackout_dates" TO "service_role";

-- =============================================================================
-- 7. Performance indexes
-- =============================================================================

-- Fast availability lookups: "what's scheduled in this room on this day?"
CREATE INDEX IF NOT EXISTS "idx_class_schedules_lookup"
  ON "public"."class_schedules" ("classroom_id", "semester", "day_of_week");

-- Fast room listing by building
CREATE INDEX IF NOT EXISTS "idx_classrooms_building"
  ON "public"."classrooms" ("building_id");

-- Fast favorites listing for a user
CREATE INDEX IF NOT EXISTS "idx_favorites_user"
  ON "public"."favorites" ("user_id");

-- Active reports for a classroom
CREATE INDEX IF NOT EXISTS "idx_reports_classroom_status"
  ON "public"."reports" ("classroom_id", "status")
  WHERE "status" IN ('pending', 'reviewed');

-- Blackout date lookup
CREATE INDEX IF NOT EXISTS "idx_blackout_dates_date"
  ON "public"."blackout_dates" ("date");
