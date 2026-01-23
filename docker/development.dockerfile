FROM oven/bun:latest

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package.json  ./
COPY bun.lock ./

COPY .env.dev .env

RUN bun install

COPY . .

RUN bun run prisma:generate

CMD ["bun", "run", "--watch", "dev"]