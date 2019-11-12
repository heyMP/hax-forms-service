# Migration `20191112211346-init`

This migration has been generated at 11/12/2019, 9:13:46 PM.
You can check out the [state of the datamodel](./datamodel.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."Submission" (
  "createdAt" timestamp(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
  "id" text NOT NULL  ,
  "updatedAt" timestamp(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
  "values" text   ,
  PRIMARY KEY ("id")
);

CREATE TABLE "public"."Form" (
  "createdAt" timestamp(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
  "id" text NOT NULL  ,
  "reference" text NOT NULL DEFAULT '' ,
  "updatedAt" timestamp(3) NOT NULL DEFAULT '1970-01-01 00:00:00' ,
  PRIMARY KEY ("id")
);

ALTER TABLE "public"."Submission" ADD COLUMN "form" text   REFERENCES "public"."Form"("id") ON DELETE SET NULL;

CREATE UNIQUE INDEX "Form.reference" ON "public"."Form"("reference")
```

## Changes

```diff
diff --git datamodel.mdl datamodel.mdl
migration ..20191112211346-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,24 @@
+datasource db {
+  provider = env("PRISMA_DB_PROVIDER")
+  url      = env("PRISMA_DB_URL")
+}
+
+generator photon {
+  provider = "photonjs"
+}
+
+model Submission {
+  id        String   @default(cuid()) @id
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
+  form      Form?
+  values    String?
+}
+
+model Form {
+  id          String       @default(cuid()) @id
+  createdAt   DateTime     @default(now())
+  updatedAt   DateTime     @updatedAt
+  reference   String       @unique
+  submissions Submission[]
+}
```

## Photon Usage

You can use a specific Photon built for this migration (20191112211346-init)
in your `before` or `after` migration script like this:

```ts
import Photon from '@generated/photon/20191112211346-init'

const photon = new Photon()

async function main() {
  const result = await photon.users()
  console.dir(result, { depth: null })
}

main()

```
