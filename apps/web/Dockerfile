FROM node:22-alpine

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY turbo.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/db/package.json packages/db/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/types/package.json packages/types/
COPY packages/typescript-config/package.json packages/typescript-config/
COPY packages/ui/package.json packages/ui/

RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile

COPY /apps/web ./apps/web
COPY /packages ./packages

ENV DATABASE_URL=${DATABASE_URL}

RUN pnpm --filter db exec prisma generate

RUN pnpm --filter web build

EXPOSE 3000

CMD [ "pnpm","dev:web"]