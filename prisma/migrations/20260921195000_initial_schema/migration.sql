CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "graft_status" AS ENUM ('ACTIVE', 'INACTIVE', 'REMOVED');
CREATE TYPE "map_reference_object_type" AS ENUM ('BUILDING', 'FENCE');

CREATE TABLE "gardens" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "widthMeters" DECIMAL(10,2) NOT NULL,
    "heightMeters" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "gardens_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "gardens_dimensions_positive" CHECK ("widthMeters" > 0 AND "heightMeters" > 0)
);

CREATE TABLE "fruit_species" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(120) NOT NULL,
    "scientificName" VARCHAR(180),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "fruit_species_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "fruit_varieties" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "speciesId" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "aliases" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "description" TEXT,
    "harvestStartMonth" INTEGER,
    "harvestStartDay" INTEGER,
    "harvestEndMonth" INTEGER,
    "harvestEndDay" INTEGER,
    "typicalStorageDaysMin" INTEGER,
    "typicalStorageDaysMax" INTEGER,
    "storageConditions" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "fruit_varieties_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "fruit_varieties_harvest_window_complete" CHECK (
      ("harvestStartMonth" IS NULL AND "harvestStartDay" IS NULL AND "harvestEndMonth" IS NULL AND "harvestEndDay" IS NULL)
      OR
      ("harvestStartMonth" BETWEEN 1 AND 12 AND "harvestStartDay" BETWEEN 1 AND 31
       AND "harvestEndMonth" BETWEEN 1 AND 12 AND "harvestEndDay" BETWEEN 1 AND 31)
    ),
    CONSTRAINT "fruit_varieties_storage_range_valid" CHECK (
      ("typicalStorageDaysMin" IS NULL AND "typicalStorageDaysMax" IS NULL)
      OR
      ("typicalStorageDaysMin" >= 0 AND "typicalStorageDaysMax" >= "typicalStorageDaysMin")
    )
);

CREATE TABLE "trees" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "gardenId" UUID NOT NULL,
    "speciesId" UUID NOT NULL,
    "label" VARCHAR(120) NOT NULL,
    "x" DECIMAL(10,2) NOT NULL,
    "y" DECIMAL(10,2) NOT NULL,
    "plantingDate" DATE,
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "trees_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "trees_coordinates_nonnegative" CHECK ("x" >= 0 AND "y" >= 0)
);

CREATE TABLE "grafts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "treeId" UUID NOT NULL,
    "varietyId" UUID NOT NULL,
    "speciesId" UUID NOT NULL,
    "graftingDate" DATE,
    "status" "graft_status" NOT NULL DEFAULT 'ACTIVE',
    "harvestStartMonthOverride" INTEGER,
    "harvestStartDayOverride" INTEGER,
    "harvestEndMonthOverride" INTEGER,
    "harvestEndDayOverride" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "grafts_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "grafts_harvest_override_complete" CHECK (
      ("harvestStartMonthOverride" IS NULL AND "harvestStartDayOverride" IS NULL AND "harvestEndMonthOverride" IS NULL AND "harvestEndDayOverride" IS NULL)
      OR
      ("harvestStartMonthOverride" BETWEEN 1 AND 12 AND "harvestStartDayOverride" BETWEEN 1 AND 31
       AND "harvestEndMonthOverride" BETWEEN 1 AND 12 AND "harvestEndDayOverride" BETWEEN 1 AND 31)
    )
);

CREATE TABLE "variety_sources" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "varietyId" UUID NOT NULL,
    "sourceName" VARCHAR(180) NOT NULL,
    "sourceUrl" TEXT,
    "retrievedAt" TIMESTAMPTZ(6),
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "variety_sources_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "map_reference_objects" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "gardenId" UUID NOT NULL,
    "type" "map_reference_object_type" NOT NULL,
    "label" VARCHAR(120),
    "x" DECIMAL(10,2) NOT NULL,
    "y" DECIMAL(10,2) NOT NULL,
    "widthMeters" DECIMAL(10,2),
    "heightMeters" DECIMAL(10,2),
    "endX" DECIMAL(10,2),
    "endY" DECIMAL(10,2),
    "rotationDegrees" DECIMAL(5,2),
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "map_reference_objects_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "map_reference_objects_geometry_valid" CHECK (
      ("type" = 'BUILDING'
       AND "x" >= 0 AND "y" >= 0
       AND "widthMeters" > 0 AND "heightMeters" > 0
       AND "endX" IS NULL AND "endY" IS NULL
       AND ("rotationDegrees" IS NULL OR "rotationDegrees" >= 0 AND "rotationDegrees" < 360))
      OR
      ("type" = 'FENCE'
       AND "x" >= 0 AND "y" >= 0 AND "endX" >= 0 AND "endY" >= 0
       AND "widthMeters" IS NULL AND "heightMeters" IS NULL AND "rotationDegrees" IS NULL)
    )
);

CREATE UNIQUE INDEX "fruit_species_name_key" ON "fruit_species"("name");
CREATE UNIQUE INDEX "fruit_varieties_speciesId_name_key" ON "fruit_varieties"("speciesId", "name");
CREATE UNIQUE INDEX "fruit_varieties_id_speciesId_key" ON "fruit_varieties"("id", "speciesId");
CREATE INDEX "fruit_varieties_speciesId_idx" ON "fruit_varieties"("speciesId");
CREATE UNIQUE INDEX "trees_id_speciesId_key" ON "trees"("id", "speciesId");
CREATE INDEX "trees_gardenId_idx" ON "trees"("gardenId");
CREATE INDEX "trees_gardenId_speciesId_idx" ON "trees"("gardenId", "speciesId");
CREATE INDEX "grafts_treeId_idx" ON "grafts"("treeId");
CREATE INDEX "grafts_varietyId_idx" ON "grafts"("varietyId");
CREATE INDEX "grafts_speciesId_idx" ON "grafts"("speciesId");
CREATE INDEX "variety_sources_varietyId_idx" ON "variety_sources"("varietyId");
CREATE INDEX "map_reference_objects_gardenId_idx" ON "map_reference_objects"("gardenId");

ALTER TABLE "fruit_varieties"
  ADD CONSTRAINT "fruit_varieties_speciesId_fkey"
  FOREIGN KEY ("speciesId") REFERENCES "fruit_species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "trees"
  ADD CONSTRAINT "trees_gardenId_fkey"
  FOREIGN KEY ("gardenId") REFERENCES "gardens"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "trees_speciesId_fkey"
  FOREIGN KEY ("speciesId") REFERENCES "fruit_species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "grafts"
  ADD CONSTRAINT "grafts_treeId_speciesId_fkey"
  FOREIGN KEY ("treeId", "speciesId") REFERENCES "trees"("id", "speciesId") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "grafts_varietyId_speciesId_fkey"
  FOREIGN KEY ("varietyId", "speciesId") REFERENCES "fruit_varieties"("id", "speciesId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "variety_sources"
  ADD CONSTRAINT "variety_sources_varietyId_fkey"
  FOREIGN KEY ("varietyId") REFERENCES "fruit_varieties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "map_reference_objects"
  ADD CONSTRAINT "map_reference_objects_gardenId_fkey"
  FOREIGN KEY ("gardenId") REFERENCES "gardens"("id") ON DELETE CASCADE ON UPDATE CASCADE;
