# ==========================
# Unified Analytics API
# Production Dockerfile
# ==========================

# 1️⃣ Base image
FROM node:22-alpine

# 2️⃣ Create working directory
WORKDIR /app

# 3️⃣ Copy package files first (for caching)
COPY package*.json ./

# 4️⃣ Install required production dependencies
RUN npm install --omit=dev

# 5️⃣ Copy rest of the source code
COPY . .

# 6️⃣ Set NODE_ENV
ENV NODE_ENV=production

# 7️⃣ Expose API port
EXPOSE 5000

# 8️⃣ Start the server
CMD ["node", "src/server.js"]
