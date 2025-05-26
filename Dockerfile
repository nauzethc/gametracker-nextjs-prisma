FROM node:20
EXPOSE 3000
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install --silent

# Build
COPY . .
RUN npm run build

# Run
CMD ["/bin/bash", "entrypoint.sh"]
