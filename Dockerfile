FROM node:22.12.0 as stage1
WORKDIR /habits_tracker
COPY package.json ./
RUN npm install 

FROM node:22.12.0 as stage2
WORKDIR /habits_tracker
COPY . .
COPY --from=stage1 /habits_tracker/node_modules ./node_modules
RUN npm run build 

FROM node:22.12.0 as final
WORKDIR /habits_tracker
ENV NODE_ENV production
COPY --from=stage2 /habits_tracker ./

EXPOSE 3000
CMD ["npm", "start"]