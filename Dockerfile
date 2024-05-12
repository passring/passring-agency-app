#  Node.js LTS installing
FROM node:lts AS build

RUN mkdir -p /usr/src/app/

# Initial work directory as app
WORKDIR /usr/src/app/

# Copy pack json, lock for dependencies
COPY package.json .

# Install dependency
RUN npm install

# Copy all files to created container
COPY . .

# build our solution
RUN npm run build-only

EXPOSE 24678

ENTRYPOINT ["npm", "run", "preview"]