#!/bin/sh
set -eu

npx prisma db push --schema=apps/api/prisma/schema.prisma
exec node apps/api/dist/main.js

