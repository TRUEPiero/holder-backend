FROM oven/bun:latest

WORKDIR /app

COPY package.json  ./
COPY bun.lock ./

COPY .env.dev .env

RUN bun install

RUN bun run prisma:generate

CMD ["bun", "run", "--watch", "dev"]