FROM node:18-alpine   # Use a base image
WORKDIR /app          # Set the working directory
COPY . .              # Copy source files into the image
RUN npm install       # Install dependencies
CMD ["npm", "start"]  # Command to run the application