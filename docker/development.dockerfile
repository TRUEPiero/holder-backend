FROM oven/bun:latest

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package.json package.json
COPY bun.lock bun.lock

COPY .env.dev .env

RUN bun install

COPY src ./src/
COPY modules ./modules/
COPY prisma ./prisma/

RUN bun run prisma:generate

CMD ["bun", "run", "--watch", "dev"]