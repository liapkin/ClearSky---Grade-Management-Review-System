# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy the rest of the app
COPY . .

# Expose the port your app listens on (adjust if needed)
EXPOSE 3000

# Command to run your app
<<<<<<< HEAD
CMD ["node", "main.js"]
=======
CMD ["node", "index.js"]
>>>>>>> aefad8b1c499988cef7538bb518611ec39370009
