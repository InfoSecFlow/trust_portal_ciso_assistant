FROM node:22-slim AS build

RUN corepack enable && corepack prepare pnpm@10.18.1 --activate

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:22-slim AS runtime

WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/package.json .
COPY --from=build /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "build"]
