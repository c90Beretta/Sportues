#!/bin/sh
set -eu

npm ci --prefer-offline --no-audit --no-fund
npm run build --workspace=@gimnasio/shared
npm run prisma:generate --workspace=api

if [ ! -f apps/api/.env ]; then
  cp apps/api/.env.example apps/api/.env
fi

