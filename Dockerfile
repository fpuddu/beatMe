# Stage 1: Build React client
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client/ ./
ENV REACT_APP_API_URL=/api
ENV REACT_APP_WS_URL=
RUN npm run build

# Stage 2: Build NestJS server
FROM node:20-alpine AS server-build
WORKDIR /app/server
COPY server/package.json server/package-lock.json ./
RUN npm ci
COPY server/ ./
RUN npm run build

# Stage 3: Production image
FROM node:20-alpine
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev && apk del python3 make g++
COPY --from=server-build /app/server/dist ./dist
COPY --from=client-build /app/client/build ./client

EXPOSE 8080
ENV PORT=8080
CMD ["node", "dist/main.js"]
