# Stage 1
FROM node:18-slim AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY . .
RUN npm run build
# Stage 2 

FROM node:18-slim AS runner
WORKDIR /app

# Copy only necessary files
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled build from builder
COPY --from=builder /app/dist ./dist

# Expose port and start app
EXPOSE 3000
CMD ["node", "dist/index.js"]