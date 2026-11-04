# Database migrations

New databases run all checked-in migrations through `npm start` (`prisma migrate deploy`).

The existing Render database was previously updated with `prisma db push`. Before deploying this migration-aware startup to that database, run `npm run db:baseline` once from `backend` with its `DATABASE_URL` configured. This marks the migrations that are already represented in that database as applied; the later migrations remain pending and are applied by the next `npm start`. Do not run the baseline command against an empty database.
