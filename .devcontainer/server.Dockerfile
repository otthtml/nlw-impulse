FROM node:16

# working directory
WORKDIR /server

# run the app
CMD npm install && npm run dev